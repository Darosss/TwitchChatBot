import {
  getCurrentStreamSession,
  updateCurrentStreamSession,
} from "@services/streamSessions";
import { createUserIfNotExist, isUserInDB, updateUser } from "@services/users";
import { ApiClient, HelixChatChatter, HelixPrivilegedUser } from "@twurple/api";
import { getBaseLog } from "@utils/getBaseLogUtil";
import removeDifferenceFromSet from "@utils/removeDifferenceSetUtil";
import { ILoyaltyHandlerConfig } from "./types";

import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@libs/types";
import { Server } from "socket.io";

import retryWithCatch from "@utils/retryWithCatchUtil";
import HeadHandler from "./HeadHandler";
import { IStreamSession } from "@models/types";
import { watcherLogger } from "@utils/loggerUtil";

class LoyaltyHandler extends HeadHandler {
  private configs: ILoyaltyHandlerConfig;
  private usersBefore = new Set<string>();
  private currentSession: IStreamSession | null | undefined;

  constructor(
    twitchApi: ApiClient,
    socketIO: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >,
    authorizedUser: HelixPrivilegedUser,
    configs: ILoyaltyHandlerConfig
  ) {
    super(socketIO, twitchApi, authorizedUser);
    this.configs = configs;

    this.init();
  }

  async init() {
    setInterval(async () => {
      await this.checkChatters(/* id */);
    }, this.configs.intervalCheckChatters * 1000);
  }

  public async refreshConfigs(refreshedConfigs: ILoyaltyHandlerConfig) {
    this.configs = refreshedConfigs;
  }

  async getStreamChatters() {
    const listOfChatters = await retryWithCatch(() =>
      this.twitchApi.chat.getChatters(
        this.authorizedUser.id,
        this.authorizedUser.id
      )
    );

    return listOfChatters;
  }

  async checkWatchersLogic(userId: string, userName: string) {
    const { watch: watchIncr, watchMultipler: watchMult } =
      this.configs.pointsIncrement;

    this.currentSession = await updateCurrentStreamSession({
      $inc: {
        [`watchers.${userName}`]: this.configs.intervalCheckChatters,
      },
    });

    const viewerWatchTime = this.currentSession?.watchers?.get(userName);
    const multipler =
      getBaseLog(
        watchMult,
        viewerWatchTime
          ? viewerWatchTime / this.configs.intervalCheckChatters
          : 1
      ) + 1;

    const pointsWithMultip = watchIncr * multipler;
    watcherLogger.info(
      `${userName} is watching(${Math.round(
        Number(viewerWatchTime) / 60
      )}min) adding points ${watchIncr} * ${multipler.toFixed(
        3
      )} = ${pointsWithMultip.toFixed(3)}`
    );

    await this.updateWatcherStatistics(userId, pointsWithMultip);
  }

  async handleActiveUsers(chatters: HelixChatChatter[]) {
    const usersNow = new Set<string>();
    for await (const user of chatters) {
      const { userName, userDisplayName, userId } = user;

      usersNow.add(userName);
      const userDB = await createUserIfNotExist(
        { twitchName: userName },
        {
          username: userDisplayName,
          twitchId: userId,
          twitchName: userName,
          privileges: 0,
        }
      );

      if (this.usersBefore.has(userName)) {
        //count points for beeing on stream
        await this.checkWatchersLogic(userId, userName);
      }

      if (!this.usersBefore.has(userName) && userDB) {
        this.socketIO.emit(
          "userJoinTwitchChat",
          { eventDate: new Date(), eventName: "Join chat" },
          userDB
        );
      }

      this.usersBefore.add(userName);
    }

    return usersNow;
  }

  async handleLeftUsers() {
    for await (const userLeft of this.usersBefore) {
      const userDB = await isUserInDB({ twitchName: userLeft });
      // const userDB = await this.isUserInDB(userLeft);
      if (userDB) {
        this.socketIO.emit(
          "userJoinTwitchChat",
          { eventDate: new Date(), eventName: "Left chat" },
          userDB
        );
      }
    }
  }

  async checkChatters(/* broadcasterId: string */) {
    const listOfChatters = await this.getStreamChatters();

    const { data: chatters } = listOfChatters;

    const usersNow = await this.handleActiveUsers(chatters);

    removeDifferenceFromSet(this.usersBefore, usersNow);

    await this.handleLeftUsers();
    this.usersBefore = new Set(usersNow);
    usersNow.clear();
  }

  async updateWatcherStatistics(userId: string, value: number) {
    const updateData = {
      $inc: { points: value, watchTime: this.configs.intervalCheckChatters },
      // add points by message,       count messages
      $set: { lastSeen: new Date() },
      // set last seen to new Date()
    };

    await updateUser({ twitchId: userId }, updateData);
  }
}

export default LoyaltyHandler;

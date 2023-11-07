import { updateCurrentStreamSession, createUserIfNotExist, isUserInDB, updateUser, getOneUser } from "@services";
import { ApiClient, HelixChatChatter } from "@twurple/api";
import { getBaseLog, removeDifferenceFromSet, retryWithCatch, watcherLogger } from "@utils";
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@socket";
import { Server } from "socket.io";
import HeadHandler from "./HeadHandler";
import { LoyaltyConfigs, PointsConfigs, StreamSessionModel } from "@models";
import { AuthorizedUserData } from "./types";
import AchievementsHandler from "./AchievementsHandler";

interface LoyaltyConfigsHandler extends LoyaltyConfigs, PointsConfigs {}

class LoyaltyHandler extends HeadHandler {
  private configs: LoyaltyConfigsHandler;
  private usersBefore = new Set<string>();
  private currentSession: StreamSessionModel | null | undefined;
  private checkChattersTimeout: NodeJS.Timeout | undefined;
  private achievementsHandler: AchievementsHandler;
  constructor(
    twitchApi: ApiClient,
    socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    authorizedUser: AuthorizedUserData,
    configs: LoyaltyConfigsHandler,
    achievementsHandler: AchievementsHandler
  ) {
    super(socketIO, twitchApi, authorizedUser);
    this.configs = configs;
    this.achievementsHandler = achievementsHandler;
    this.init();
  }

  private async init() {
    this.checkChattersTimeout = setInterval(async () => {
      await this.checkChatters();
    }, this.configs.intervalCheckChatters * 1000);
  }

  public async refreshConfigs(configs: LoyaltyConfigsHandler) {
    this.stopCheckChatters();
    this.configs = configs;
    this.init();
  }

  public stopCheckChatters() {
    clearInterval(this.checkChattersTimeout);
  }

  private async getStreamChatters() {
    const listOfChatters = await retryWithCatch(() => this.twitchApi.chat.getChatters(this.authorizedUser.id));

    return listOfChatters;
  }

  private async checkWatchersLogic(userId: string, userName: string) {
    const { watch: watchIncr, watchMultipler: watchMult } = this.configs.pointsIncrement;

    this.currentSession = await updateCurrentStreamSession({
      $inc: {
        [`watchers.${userName}`]: this.configs.intervalCheckChatters
      }
    });
    if (!this.currentSession) return;

    const viewerWatchTime = this.currentSession.watchers?.get(userName);
    const multipler =
      getBaseLog(watchMult, viewerWatchTime ? viewerWatchTime / this.configs.intervalCheckChatters : 1) + 1;

    const pointsWithMultip = watchIncr * multipler;
    watcherLogger.info(
      `${userName} is watching(${Math.round(
        Number(viewerWatchTime) / 60
      )}min) adding points ${watchIncr} * ${multipler.toFixed(3)} = ${pointsWithMultip.toFixed(3)}`
    );

    await this.updateWatcherStatistics(userId, pointsWithMultip);
  }

  private async checkUserFollow(user: HelixChatChatter) {
    const follower = await retryWithCatch(() =>
      this.twitchApi.channels.getChannelFollowers(this.authorizedUser.id, user.userId)
    );

    return follower?.data?.at(0)?.followDate;
  }

  private async updateFollowerStatus(users: HelixChatChatter[]) {
    for (const user of users) {
      const userFollow = await this.checkUserFollow(user);
      await updateUser({ twitchName: user.userName }, { follower: userFollow });
    }
  }

  private async updateEventsInCurrentSession(userId: string, event: string) {
    this.currentSession = await updateCurrentStreamSession({
      $push: {
        // events: [userId, event],
        events: { user: userId, name: event }
      }
    });
  }

  private async handleActiveUsers(chatters: HelixChatChatter[]) {
    const usersNow = new Set<string>();
    for await (const user of chatters) {
      const { userName, userDisplayName, userId } = user;

      usersNow.add(userName);

      const userDB = await createUserIfNotExist(
        { twitchId: userId },
        {
          username: userDisplayName,
          twitchId: userId,
          twitchName: userName,
          privileges: 0
        }
      );

      if (this.usersBefore.has(userName)) {
        //count points for beeing on stream
        await this.checkWatchersLogic(userId, userName);
      }

      if (!this.usersBefore.has(userName) && userDB) {
        await this.updateEventsInCurrentSession(userDB.id, "Join chat");

        this.socketIO.emit("userJoinTwitchChat", {
          eventDate: new Date(),
          eventName: "Join chat",
          user: userDB
        });
      }

      this.usersBefore.add(userName);
    }

    return usersNow;
  }

  private async handleLeftUsers() {
    for await (const userLeft of this.usersBefore) {
      const userDB = await isUserInDB({ twitchName: userLeft });
      // const userDB = await this.isUserInDB(userLeft);
      if (userDB) {
        await this.updateEventsInCurrentSession(userDB.id, "Left chat");

        this.socketIO.emit("userJoinTwitchChat", {
          eventDate: new Date(),
          eventName: "Left chat",
          user: userDB
        });
      }
    }
  }

  private async checkChatters() {
    const listOfChatters = await this.getStreamChatters();

    const { data: chatters } = listOfChatters;

    const usersNow = await this.handleActiveUsers(chatters);

    await this.updateFollowerStatus(chatters);
    await this.updateLoyaltyAchievements(chatters);

    removeDifferenceFromSet(this.usersBefore, usersNow);

    await this.handleLeftUsers();
    this.usersBefore = new Set(usersNow);

    usersNow.clear();
  }

  private async updateWatcherStatistics(userId: string, value: number) {
    const updateData = {
      $inc: { points: value, watchTime: this.configs.intervalCheckChatters },
      // add points by message,       count messages
      $set: { lastSeen: new Date() }
      // set last seen to new Date()
    };

    await updateUser({ twitchId: userId }, updateData);
  }

  private async updateLoyaltyAchievements(chatters: HelixChatChatter[]) {
    for (const { userId } of chatters) {
      const foundUser = await getOneUser({ twitchId: userId }, {});
      if (!foundUser) return watcherLogger.error("updateLoyaltyAchievements - user  not found");

      await this.achievementsHandler.checkUserMessagesCountForAchievement({
        userId: foundUser._id,
        username: foundUser.username,
        progress: { value: foundUser.messageCount || 0 }
      });
      await this.achievementsHandler.checkUserWatchTimeForAchievement({
        userId: foundUser._id,
        username: foundUser.username,
        progress: { value: foundUser.watchTime || 0 }
      });
      await this.achievementsHandler.checkUserPointsForAchievement({
        userId: foundUser._id,
        username: foundUser.username,
        progress: { value: foundUser.points || 0 }
      });
    }
  }
}

export default LoyaltyHandler;

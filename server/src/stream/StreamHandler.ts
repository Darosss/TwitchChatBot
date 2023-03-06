import { ApiClient, HelixPrivilegedUser } from "@twurple/api";
import { IConfigDocument, IUser } from "@models/types";
import { IConfigDefaults } from "@defaults/types";
import { configDefaults } from "@defaults/configsDefaults";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";
import { Server } from "socket.io";

import {
  getCurrentStreamSession,
  updateStreamSessionById,
} from "@services/streamSessions";
import retryWithCatch from "@utils/retryWithCatchUtil";

import CommandsHandler from "./CommandsHandler";
import TriggersHandler from "./TriggersHandler";
import LoyaltyHandler from "./LoyaltyHandler";
import MessagesHandler from "./MessagesHandler";
import { getConfigs } from "@services/configs";
import { headLogger } from "@utils/loggerUtil";

interface IStreamHandlerOptions {
  config: IConfigDocument;
  twitchApi: ApiClient;
  socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  authorizedUser: HelixPrivilegedUser;
}

class StreamHandler {
  private twitchApi: ApiClient;
  private authorizedUser: HelixPrivilegedUser;
  private socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

  private commandsHandler: CommandsHandler;
  private triggersHandler: TriggersHandler;
  private messagesHandler: MessagesHandler;
  private loayaltyHandler: LoyaltyHandler;
  private configs: IConfigDefaults;

  constructor(options: IStreamHandlerOptions) {
    const { twitchApi, socketIO, authorizedUser } = options;
    this.twitchApi = twitchApi;
    this.socketIO = socketIO;

    this.authorizedUser = authorizedUser;
    this.configs = { ...configDefaults };

    this.commandsHandler = new CommandsHandler(this.configs.commandsPrefix);
    this.messagesHandler = new MessagesHandler(this.configs.pointsIncrement);
    this.triggersHandler = new TriggersHandler();
    this.loayaltyHandler = new LoyaltyHandler(
      twitchApi,
      socketIO,
      this.authorizedUser,
      this.configs
    );

    this.init();
    this.initSocketEvents();
  }

  public async onMessageEvents(user: IUser, message: string) {
    let messagesToSend: string[] = [];
    const dataEvent = new Date();

    await this.messagesHandler.saveMessageAndUpdateUser(
      user._id,
      user.username,
      dataEvent,
      message
    );

    const commandAnswer = await this.commandsHandler.checkMessageForCommand(
      user,
      message
    );

    const triggerAnswer = await this.triggersHandler.checkMessageForTrigger(
      message
    );

    commandAnswer ? messagesToSend.push(commandAnswer) : null;
    triggerAnswer ? messagesToSend.push(triggerAnswer) : null;

    return messagesToSend;
  }
  // private async debugFollows() {
  //   const follows = await this.twitchApi.users.getFollows({
  //     followedUser: 147192097,
  //     limit: 100,
  //   });
  //   await addFollowersTemp(follows.data);
  // }
  async init() {
    const { id } = this.authorizedUser;
    await this.refreshConfigs();

    setInterval(async () => {
      await this.checkCountOfViewers(id);
    }, this.configs.intervalCheckViewersPeek * 1000);
  }

  async refreshConfigs() {
    const refreshedConfigs = await getConfigs();
    if (refreshedConfigs) {
      this.configs = refreshedConfigs;
      const { pointsIncrement, intervalCheckChatters } = this.configs;

      this.messagesHandler.refreshConfigs(pointsIncrement);
      this.loayaltyHandler.refreshConfigs({
        pointsIncrement: pointsIncrement,
        intervalCheckChatters: intervalCheckChatters,
      });
    }
  }

  initSocketEvents() {
    this.socketIO.on("connect", (socket) => {
      socket.on("saveConfigs", async () => {
        headLogger.info("Client saved configs - refreshing");
        await this.refreshConfigs();
      });

      socket.on("refreshTriggers", async () => {
        headLogger.info(
          "Client created/updated/deleted trigger - refreshing triggers"
        );
        await this.triggersHandler.refreshTriggers();
      });

      socket.on("refreshCommands", async () => {
        headLogger.info(
          "Client created/updated/deleted command - refreshing commands"
        );
        await this.commandsHandler.refreshCommands();
      });
    });
  }

  async checkCountOfViewers(broadcasterId: string) {
    const currentSession = await getCurrentStreamSession({});
    const streamInfo = await retryWithCatch(() =>
      this.twitchApi.streams.getStreamByUserId(broadcasterId)
    );

    if (!currentSession || !streamInfo) return;

    const viewersPeek = new Map<string, number>();
    viewersPeek.set(String(new Date().getTime()), streamInfo.viewers);
    const timestamp = Date.now();

    updateStreamSessionById(currentSession.id, {
      $set: { [`viewers.${timestamp}`]: streamInfo.viewers },
    });
  }

  // TODO: this is loyalty??

  // async updateEveryUserTwitchDetails(broadcasterId: string) {
  //   const limit = 50;
  //   let index = 0;

  //   const checkUsersTimer = setInterval(async () => {
  //     const usernames = await getTwitchNames(limit, limit * index);
  //     if (!usernames) return;

  //     const usersTwitch = await retryWithCatch(() =>
  //       this.twitchApi.users.getUsersByNames(usernames.twitchNames)
  //     );
  //     if (!usersTwitch) return;

  //     for await (const user of usersTwitch) {
  //       // const follower = await retryWithCatch(async () => {
  //       //   for await (const user of usersTwitch) {
  //       //     await user.getFollowTo(broadcasterId);
  //       //   }
  //       // });
  //       //   user.follower = follower?.followDate;
  //       //   await user.save();
  //       console.log("user", user.displayName);
  //     }

  //     index++;
  //     if (limit * index > usernames.total) {
  //       console.log("Finished checking users - clear interval");
  //       clearInterval(checkUsersTimer);
  //     }
  //   }, 10000);
  // }
}

export default StreamHandler;

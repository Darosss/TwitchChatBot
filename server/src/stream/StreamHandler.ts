import { ApiClient, HelixPrivilegedUser } from "@twurple/api";
import { ConfigDocument } from "@models/types";
import { ConfigDefaults } from "@defaults/types";
import { configDefaults } from "@defaults/configsDefaults";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";
import { Server, Socket } from "socket.io";

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
import { headLogger, messageLogger } from "@utils/loggerUtil";
import TimersHandler from "./TimersHandler";
import { ChatUserstate, Client } from "tmi.js";
import { createUserIfNotExist } from "@services/users";
import { UserCreateData } from "@services/users/types";
import MusicStreamHandler from "./MusicStreamHandler";

interface StreamHandlerOptions {
  config: ConfigDocument;
  twitchApi: ApiClient;
  socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  authorizedUser: HelixPrivilegedUser;
  clientTmi: Client;
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
  private readonly clientTmi: Client;

  private commandsHandler: CommandsHandler;
  private triggersHandler: TriggersHandler;
  private messagesHandler: MessagesHandler;
  private loayaltyHandler: LoyaltyHandler;
  private timersHandler: TimersHandler;
  private musicHandler: MusicStreamHandler;
  private configs: ConfigDefaults;

  constructor(options: StreamHandlerOptions) {
    const { twitchApi, socketIO, authorizedUser, clientTmi } = options;
    this.twitchApi = twitchApi;
    this.socketIO = socketIO;
    this.clientTmi = clientTmi;

    this.authorizedUser = authorizedUser;
    this.configs = { ...configDefaults };
    this.musicHandler = new MusicStreamHandler(socketIO);
    this.commandsHandler = new CommandsHandler(this.configs.commandsConfigs);

    this.messagesHandler = new MessagesHandler(this.configs.pointsConfigs);
    this.triggersHandler = new TriggersHandler(this.configs.triggersConfigs);
    this.loayaltyHandler = new LoyaltyHandler(
      twitchApi,
      socketIO,
      this.authorizedUser,
      { ...this.configs.loyaltyConfigs, ...this.configs.pointsConfigs }
    );

    this.timersHandler = new TimersHandler(
      twitchApi,
      socketIO,
      this.authorizedUser,
      this.configs.timersConfigs,
      clientTmi.say.bind(clientTmi)
    );

    this.init();
    this.initSocketEvents();
    this.initOnMessageEvents();

    this.musicHandler.init();
  }

  private async init() {
    const { id } = this.authorizedUser;
    await this.refreshConfigs();

    setInterval(async () => {
      await this.checkCountOfViewers(id);
    }, this.configs.headConfigs.intervalCheckViewersPeek * 1000);
  }

  private async initOnMessageEvents() {
    this.clientTmi.on("message", async (channel, userstate, message, self) => {
      const userData = this.getUserStateInfo(userstate, self);

      messageLogger.info(`${userData.username}: ${message}`);
      this.socketIO.emit(
        "messageServer",
        new Date(),
        userData.username,
        message
      ); // emit for socket

      const user = await createUserIfNotExist(
        { twitchId: userData.twitchId },
        userData
      );

      if (!user) return;

      await this.messagesHandler.saveMessageAndUpdateUser(
        user._id,
        user.username,
        new Date(),
        message
      );

      if (self) return;

      const messagesQueue = (
        await Promise.all([
          this.triggersHandler.checkMessageForTrigger(message),
          this.commandsHandler.checkMessageForCommand(user, message),

          this.timersHandler.checkMessageForTimer(user),
        ])
      ).filter((x) => x) as string[];

      console.log(messagesQueue, "lol");
      this.sendMessagesFromQueue(channel, messagesQueue);
    });
  }

  private sendMessagesFromQueue(channel: string, messages: string[]) {
    messages.forEach((msgInQue) => this.clientTmi.say(channel, msgInQue));
  }
  // private async debugFollows() {
  //   const follows = await this.twitchApi.users.getFollows({
  //     followedUser: 147192097,
  //     limit: 100,
  //   });
  //   await addFollowersTemp(follows.data);
  // }

  async refreshConfigs() {
    const refreshedConfigs = await getConfigs();
    if (refreshedConfigs) {
      this.configs = refreshedConfigs;
      const {
        commandsConfigs,
        pointsConfigs,
        loyaltyConfigs,
        triggersConfigs,
        timersConfigs,
      } = this.configs;

      this.messagesHandler.refreshConfigs(pointsConfigs);
      this.loayaltyHandler.refreshConfigs({
        ...pointsConfigs,
        ...loyaltyConfigs,
      });

      this.triggersHandler.refreshConfigs(triggersConfigs);

      this.commandsHandler.refreshConfigs(commandsConfigs);

      this.timersHandler.refreshConfigs(timersConfigs);
    }
  }

  private getUserStateInfo(
    userstate: ChatUserstate,
    self: boolean
  ): UserCreateData {
    const twitchId =
      (self && process.env.botid!) ||
      userstate["user-id"] ||
      "undefinedTwitchId";
    const userData = {
      username: userstate["display-name"] || "undefinedUsername",
      twitchName: userstate.username || "undefinedTwitchName",
      twitchId: twitchId,
      privileges: 0,
    };
    return userData;
  }

  private initSocketEvents() {
    this.socketIO.on("connect", (socket) => {
      console.log("Connected - every function in bot should work now");
      socket.on("saveConfigs", async () => await this.onSaveConfigs());

      socket.on("refreshTriggers", async () => await this.onRefreshTriggers());

      socket.on("refreshCommands", async () => await this.onRefreshCommands());

      socket.on("refreshTimers", async () => await this.onRefreshTimers());

      socket.on("changeModes", async () => await this.onChangeModes());

      socket.on("messageClient", (message) => this.onMessageClient(message));

      this.onMusicHandlerEvents(socket);
    });
  }

  private async onSaveConfigs() {
    headLogger.info("Client saved configs - refreshing");
    await this.refreshConfigs();
  }

  private async onChangeModes() {
    headLogger.info(
      "Client changed modes(tag, mood, personality) - refreshing triggers, commands, message categories and timers"
    );
    await Promise.all([
      this.triggersHandler.refreshTriggers(),
      this.commandsHandler.refreshCommands(),
      this.timersHandler.refreshTimers(),
    ]);
  }

  private async onRefreshTriggers() {
    headLogger.info(
      "Client created/updated/deleted trigger - refreshing triggers"
    );
    await this.triggersHandler.refreshTriggers();
  }
  private async onRefreshCommands() {
    headLogger.info(
      "Client created/updated/deleted command - refreshing commands"
    );
    await this.commandsHandler.refreshCommands();
  }

  private async onRefreshTimers() {
    headLogger.info("Client created/updated/deleted timer - refreshing timers");
    await this.timersHandler.refreshTimers();
  }

  private onMessageClient(message: string) {
    this.clientTmi.say(this.authorizedUser.name, message);
  }

  private onMusicHandlerEvents(
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >
  ) {
    this.musicHandler.addJoinedClientAsListener(socket.id);
    socket.on("musicPause", () => {
      this.musicHandler.pausePlayer();
    });
    socket.on("musicStop", () => {});
    socket.on("musicPlay", () => {
      this.musicHandler.resumePlayer();
    });

    socket.on("musicNext", () => {
      this.musicHandler.nextSong();
    });

    socket.on("getAudioInfo", () => {
      const audioInfo = this.musicHandler.getAudioInfo();
      if (!audioInfo) return;

      this.socketIO.to(socket.id).emit("getAudioInfo", audioInfo);
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

import { ApiClient } from "@twurple/api";
import { ConfigDocument, UserModel } from "@models";
import { ConfigDefaults } from "@defaults/types";
import { configDefaults } from "@defaults/configsDefaults";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  CustomRewardCreateData,
  CustomRewardData
} from "@socket";
import { Server, Socket } from "socket.io";
import {
  getCurrentStreamSession,
  updateStreamSessionById,
  getConfigs,
  removeAuthToken,
  createUserIfNotExist,
  UserCreateData
} from "@services";

import CommandsHandler from "./CommandsHandler";
import TriggersHandler from "./TriggersHandler";
import LoyaltyHandler from "./LoyaltyHandler";
import MessagesHandler from "./MessagesHandler";
import { headLogger, messageLogger, retryWithCatch } from "@utils";
import TimersHandler from "./TimersHandler";
import { ChatUserstate } from "tmi.js";
import MusicStreamHandler from "./MusicStreamHandler";
import { alertSoundPrefix } from "@configs/globalVariables";
import EventSubHandler from "./EventSubHandler";
import ClientTmiHandler from "./TwitchTmiHandler";
import { botId } from "@configs/envVariables";
import MusicYTHandler from "./MusicYTHandler";
import { AuthorizedUserData } from "./types";
interface StreamHandlerOptions {
  config: ConfigDocument;
  twitchApi: ApiClient;
  socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  authorizedUser: AuthorizedUserData;
  clientTmi: ClientTmiHandler;
}

class StreamHandler {
  private static instance: StreamHandler;
  private twitchApi: ApiClient;
  private authorizedUser: AuthorizedUserData;
  private socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

  private clientTmi: ClientTmiHandler;
  private commandsHandler: CommandsHandler;
  private triggersHandler: TriggersHandler;
  private messagesHandler: MessagesHandler;
  private loayaltyHandler: LoyaltyHandler;
  private timersHandler: TimersHandler;
  private musicHandler: MusicStreamHandler;
  private musicYTHandler: MusicYTHandler;
  private eventSubHandler: EventSubHandler;
  private configs: ConfigDefaults;
  private loggedIn = true;

  private checkViewersInterval: NodeJS.Timeout | undefined;
  private constructor(options: StreamHandlerOptions) {
    const { twitchApi, socketIO, authorizedUser, clientTmi } = options;
    this.twitchApi = twitchApi;
    this.socketIO = socketIO;
    this.clientTmi = clientTmi;

    this.authorizedUser = authorizedUser;
    this.configs = { ...configDefaults };
    this.musicHandler = new MusicStreamHandler(socketIO, clientTmi.say.bind(clientTmi), this.configs.musicConfigs);
    this.musicYTHandler = new MusicYTHandler(socketIO, clientTmi.say.bind(clientTmi), this.configs.musicConfigs);
    this.commandsHandler = new CommandsHandler(twitchApi, socketIO, authorizedUser, this.musicYTHandler, {
      ...this.configs.commandsConfigs,
      permissionLevels: this.configs.headConfigs.permissionLevels
    });
    this.messagesHandler = new MessagesHandler(this.configs.pointsConfigs);
    this.triggersHandler = new TriggersHandler(this.configs.triggersConfigs);
    this.loayaltyHandler = new LoyaltyHandler(twitchApi, socketIO, authorizedUser, {
      ...this.configs.loyaltyConfigs,
      ...this.configs.pointsConfigs
    });

    this.timersHandler = new TimersHandler(
      twitchApi,
      socketIO,
      authorizedUser,
      this.configs.timersConfigs,
      clientTmi.say.bind(clientTmi)
    );

    this.eventSubHandler = EventSubHandler.getInstance({
      apiClient: twitchApi,
      socketIO: socketIO,
      authorizedUser: authorizedUser
    });

    this.init();
    this.initOnMessageEvents();
    this.initSocketEvents();

    this.triggersHandler;
    this.eventSubHandler.init();
  }

  private async init() {
    const { id } = this.authorizedUser;
    await this.refreshConfigs();
    clearInterval(this.checkViewersInterval);
    this.checkViewersInterval = setInterval(async () => {
      await this.checkCountOfViewers(id);
    }, this.configs.headConfigs.intervalCheckViewersPeek * 1000);
  }

  public static getInstance(options: StreamHandlerOptions): StreamHandler {
    if (!StreamHandler.instance) {
      StreamHandler.instance = new StreamHandler(options);
    } else {
      StreamHandler.instance.updateOptions(options);
    }
    return StreamHandler.instance;
  }

  public updateOptions(options: StreamHandlerOptions): void {
    this.loggedIn = true;
    const { twitchApi, socketIO, authorizedUser, clientTmi } = options;
    this.twitchApi = twitchApi;
    this.socketIO = socketIO;
    this.clientTmi = clientTmi;
    this.authorizedUser = authorizedUser;
    this.init();
    this.initOnMessageEvents();

    this.commandsHandler.updateProperties(twitchApi, authorizedUser);
    this.eventSubHandler.updateProperties(twitchApi, authorizedUser);
    this.loayaltyHandler.updateProperties(twitchApi, authorizedUser);
    this.timersHandler.updateProperties(twitchApi, authorizedUser);
    this.eventSubHandler = EventSubHandler.getInstance({
      apiClient: twitchApi,
      socketIO: socketIO,
      authorizedUser: authorizedUser
    });
  }

  private async initOnMessageEvents() {
    this.clientTmi.onMessageEvent(async (channel, userstate, message, self) => {
      const userData = this.getUserStateInfo(userstate, self);
      messageLogger.info(`${userData.username}: ${message}`);
      this.socketIO.emit("messageServer", new Date(), userData.username, message); // emit for socket

      const user = await createUserIfNotExist({ twitchId: userData.twitchId }, userData);

      if (!user) return;

      await this.messagesHandler.saveMessageAndUpdateUser(user._id, user.username, new Date(), message);

      if (self) return;

      await this.chceckAndSendAnswer(user, message);
    });
  }

  private async chceckAndSendAnswer(user: UserModel, message: string) {
    const commandMessage = await this.commandsHandler.checkMessageForCommand(user, message);
    if (commandMessage) {
      if (typeof commandMessage === "string") {
        this.clientTmi.say(commandMessage);
      }

      return;
    }

    //either check for timer / trigger / random message
    const messagesQueue = (
      await Promise.all([
        this.triggersHandler.checkMessageForTrigger(message),
        this.timersHandler.checkMessageForTimer(user)
      ])
    ).filter((x) => x) as string[];

    this.sendMessagesFromQueue(messagesQueue);
  }

  private sendMessagesFromQueue(messages: string[]) {
    const { min, max } = this.configs.headConfigs.delayBetweenMessages;
    messages.forEach((msgInQue, index) => {
      const delay = (index + 1) * Math.floor(Math.random() * (max - min + 1) + min);

      headLogger.info(`Send message ${msgInQue} in ${delay}ms`);
      setTimeout(() => {
        this.clientTmi.say(msgInQue);
      }, delay);
    });
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
        musicConfigs,
        headConfigs
      } = this.configs;

      this.messagesHandler.refreshConfigs(pointsConfigs);
      this.loayaltyHandler.refreshConfigs({
        ...pointsConfigs,
        ...loyaltyConfigs
      });

      this.triggersHandler.refreshConfigs(triggersConfigs);

      this.commandsHandler.refreshConfigs({
        ...commandsConfigs,
        permissionLevels: headConfigs.permissionLevels
      });

      this.timersHandler.refreshConfigs(timersConfigs);

      this.musicHandler.refreshConfigs(musicConfigs);
      this.musicYTHandler.refreshConfigs(musicConfigs);
    }
  }

  private getUserStateInfo(userstate: ChatUserstate, self: boolean): UserCreateData {
    const twitchId = (self && botId) || userstate["user-id"] || "undefinedTwitchId";
    const userData = {
      username: userstate["display-name"] || "undefinedUsername",
      twitchName: userstate.username || "undefinedTwitchName",
      twitchId: twitchId,
      privileges: 0
    };
    return userData;
  }

  private initSocketEvents() {
    this.socketIO.on("connect", (socket) => {
      socket.emit("sendLoggedUserInfo", this.loggedIn ? this.authorizedUser.name : "");

      socket.on("logout", async () => {
        await this.logoutUser();
        socket.emit("sendLoggedUserInfo", "");
      });

      socket.on("saveConfigs", async () => await this.onSaveConfigs());

      socket.on("refreshTriggers", async () => await this.onRefreshTriggers());

      socket.on("refreshCommands", async () => await this.onRefreshCommands());

      socket.on("refreshTimers", async () => await this.onRefreshTimers());

      socket.on("changeModes", async () => await this.onChangeModes());

      socket.on("createCustomReward", async (data, cb) => {
        const created = await this.onCreateCustomReward(data);

        cb(created);
      });

      socket.on("deleteCustomReward", async (id, cb) => {
        const deleted = await this.onDeleteCustomReward(id);
        if (deleted) cb(true);
        else cb(false);
      });

      socket.on("updateCustomReward", async (id, data, cb) => {
        const updated = await this.onUpdateCustomReward(id, data);
        if (updated) cb(true);
        else cb(false);
      });

      socket.on("getCustomRewards", async () => await this.onGetCustomRewards());

      socket.on("messageClient", (message) => {
        if (!message) return;
        this.clientTmi.say(message);
      });

      this.onMusicHandlerEvents(socket);

      this.onMusicYtHandlerEvents(socket);
    });
  }

  private async logoutUser() {
    await Promise.all([removeAuthToken(), this.eventSubHandler.stop(), this.clientTmi.disconnectTmi()]);
    this.loayaltyHandler.stopCheckChatters();
    this.loggedIn = false;
  }

  private async onCreateCustomReward(data: CustomRewardCreateData) {
    if (!data.title || data.cost < 0) return false;
    try {
      await this.twitchApi.channelPoints.createCustomReward(this.authorizedUser.id, {
        ...data,
        title: alertSoundPrefix + data.title
      });
      return true;
    } catch (err) {
      headLogger.error(`Error occured while creating custom reward: ${err}`);

      return false;
    }
  }

  private async onDeleteCustomReward(id: string) {
    try {
      await this.twitchApi.channelPoints.deleteCustomReward(this.authorizedUser.id, id);
      return true;
    } catch (err) {
      headLogger.error(`Error occured while deleting custom reward: ${err}`);

      return false;
    }
  }
  private async onUpdateCustomReward(id: string, data: CustomRewardCreateData) {
    try {
      let title = data.title;
      if (!data.title.startsWith(alertSoundPrefix)) {
        title = alertSoundPrefix + title;
      }
      await this.twitchApi.channelPoints.updateCustomReward(this.authorizedUser.id, id, { ...data, title: title });
      return true;
    } catch (err) {
      headLogger.error(`Error occured while updating custom reward: ${err}`);

      return false;
    }
  }

  private async onGetCustomRewards() {
    const rewards = await this.twitchApi.channelPoints.getCustomRewards(this.authorizedUser.id);
    const customRewardsData: CustomRewardData[] = rewards
      .filter((reward) => reward.title.startsWith(alertSoundPrefix))
      .map((reward) => {
        return {
          title: reward.title,
          maxRedemptionsPerStream: reward.maxRedemptionsPerStream,
          maxRedemptionsPerUserPerStream: reward.maxRedemptionsPerUserPerStream,
          isInStock: reward.isInStock,
          isEnabled: reward.isEnabled,
          id: reward.id,
          cost: reward.cost,
          broadcasterId: reward.broadcasterId,
          autoFulfill: reward.autoFulfill
        };
      });
    this.socketIO.emit("getCustomRewards", customRewardsData);
  }

  private async onSaveConfigs() {
    headLogger.info("Client saved configs - refreshing");
    await this.refreshConfigs();
  }

  private async onChangeModes() {
    headLogger.info(
      "Client changed modes(tag, mood, affix) - refreshing triggers, commands, message categories and timers"
    );
    await Promise.all([
      this.triggersHandler.refreshTriggers(),
      this.commandsHandler.refreshCommands(),
      this.timersHandler.refreshTimers()
    ]);
  }

  private async onRefreshTriggers() {
    headLogger.info("Client created/updated/deleted trigger - refreshing triggers");
    await this.triggersHandler.refreshTriggers();
  }
  private async onRefreshCommands() {
    headLogger.info("Client created/updated/deleted command - refreshing commands");
    await this.commandsHandler.refreshCommands();
  }

  private async onRefreshTimers() {
    headLogger.info("Client created/updated/deleted timer - refreshing timers");
    await this.timersHandler.refreshTimers();
  }

  private onMusicHandlerEvents(
    socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  ) {
    socket.on("getAudioStreamData", (cb) => {
      const audioData = this.musicHandler.getAudioStreamData();
      const isPlaying = this.musicHandler.isMusicPlaying();
      if (!audioData) return;
      cb(isPlaying, audioData);
    });

    socket.on("musicPause", () => {
      this.musicHandler.pausePlayer();
    });

    socket.on("musicStop", () => {
      console.log("Add soon");
      //TODO: add music stop
    });

    socket.on("musicPlay", () => {
      this.musicHandler.resumePlayer();
    });
    socket.on("loadSongs", (folderName) => {
      this.musicHandler.loadNewSongs(folderName, true);
    });

    socket.on("musicNext", () => {
      this.musicHandler.nextSong();
    });

    socket.on("changeVolume", (volume) => {
      this.musicHandler.changeVolume(volume);
    });

    socket.on("getAudioInfo", () => {
      const audioInfo = this.musicHandler.getAudioInfo();
      if (!audioInfo) return;

      this.socketIO.to(socket.id).emit("getAudioInfo", audioInfo);
    });
  }

  private onMusicYtHandlerEvents(
    socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  ) {
    socket.on("getAudioYTData", (cb) => {
      const audioData = this.musicYTHandler.getAudioStreamData();
      const isPlaying = this.musicYTHandler.isMusicPlaying();
      if (!audioData) return;
      cb(isPlaying, audioData);
    });
    socket.on("getAudioYTInfo", (cb) => {
      const audioData = this.musicYTHandler.getAudioInfo();
      if (!audioData) return;
      cb(audioData);
    });

    socket.on("musicYTPause", () => {
      this.musicYTHandler.pausePlayer();
    });

    socket.on("musicYTStop", () => {
      console.log("Add soon");
      //TODO: add music stop
    });

    socket.on("musicYTPlay", () => {
      this.musicYTHandler.resumePlayer();
    });

    //TODO: events from backend database?
    // socket.on('loadYTPlaylist', async (playlistId: string) => {
    //   await this.musicYTHandler.loadNewSongs('xd', true)
    // })

    socket.on("musicYTNext", () => {
      this.musicYTHandler.nextSong();
    });

    socket.on("changeYTVolume", (volume) => {
      this.musicYTHandler.changeVolume(volume);
    });
  }

  async checkCountOfViewers(broadcasterId: string) {
    const currentSession = await getCurrentStreamSession({});
    const streamInfo = await retryWithCatch(() => this.twitchApi.streams.getStreamByUserId(broadcasterId));

    if (!currentSession || !streamInfo) return;

    const viewersPeek = new Map<string, number>();
    viewersPeek.set(String(new Date().getTime()), streamInfo.viewers);
    const timestamp = Date.now();

    updateStreamSessionById(currentSession.id, {
      $set: { [`viewers.${timestamp}`]: streamInfo.viewers }
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

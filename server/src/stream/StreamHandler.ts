import { ApiClient } from "@twurple/api";
import { ConfigModel, UserModel } from "@models";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  CustomRewardCreateData,
  CustomRewardData,
  MessageServerDataBadgesPathsType,
  MessageServerDataMessageDataType
} from "@socket";
import { Server, Socket } from "socket.io";
import {
  getCurrentStreamSession,
  updateStreamSessionById,
  getConfigs,
  removeAuthToken,
  createUserIfNotExist,
  UserCreateData,
  getBadges
} from "@services";
import CommandsHandler from "./CommandsHandler";
import TriggersHandler from "./TriggersHandler";
import LoyaltyHandler from "./LoyaltyHandler";
import MessagesHandler from "./MessagesHandler";
import { headLogger, messageLogger, retryWithCatch } from "@utils";
import TimersHandler from "./TimersHandler";
import { ChatUserstate } from "tmi.js";
import MusicStreamHandler from "./MusicStreamHandler";
import { alertSoundPrefix, botId, botUsername } from "@configs";
import EventSubHandler from "./EventSubHandler";
import ClientTmiHandler from "./TwitchTmiHandler";
import MusicYTHandler from "./MusicYTHandler";
import { AuthorizedUserData } from "./types";
import { randomUUID } from "crypto";
interface StreamHandlerConfiguration {
  configs: ConfigModel;
  twitchApi: ApiClient;
  socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  authorizedUser: AuthorizedUserData;
}

interface StreamHandlerHandlers {
  clientTmi: ClientTmiHandler;
  commandsHandler: CommandsHandler;
  triggersHandler: TriggersHandler;
  messagesHandler: MessagesHandler;
  loyaltyHandler: LoyaltyHandler;
  timersHandler: TimersHandler;
  musicStreamHandler: MusicStreamHandler;
  musicYTHandler: MusicYTHandler;
  eventSubHandler: EventSubHandler;
}

interface StreamHandlerConstructorType {
  configuration: StreamHandlerConfiguration;
  handlers: StreamHandlerHandlers;
}

class StreamHandler {
  private configuration: StreamHandlerConfiguration;
  private handlers: StreamHandlerHandlers;

  private loggedIn = true;

  private checkViewersInterval: NodeJS.Timeout | undefined;
  constructor({ configuration, handlers }: StreamHandlerConstructorType) {
    this.configuration = configuration;
    this.handlers = handlers;

    this.init();
    this.initSocketEvents();
    this.initOnMessageEvents();
    this.initOnDeleteMessageEvents();
  }

  private async init() {
    const { id } = this.configuration.authorizedUser;
    await this.createBotUser();
    await this.refreshConfigs();
    clearInterval(this.checkViewersInterval);
    this.checkViewersInterval = setInterval(async () => {
      await this.checkCountOfViewers(id);
    }, this.configuration.configs.headConfigs.intervalCheckViewersPeek * 1000);
    await this.handlers.eventSubHandler.init();
  }
  private async createBotUser() {
    await createUserIfNotExist(
      { twitchId: botId },
      {
        username: botUsername,
        twitchId: botId,
        twitchName: botUsername //TODO: bot username just for now -> change later
      }
    );
  }

  public updateOptions({ configuration, handlers }: StreamHandlerConstructorType): void {
    this.loggedIn = true;
    this.configuration = configuration;
    this.handlers = handlers;
    this.init();
  }

  private initOnDeleteMessageEvents() {
    this.handlers.clientTmi.onDeleteMessageEvent((channel, username, userstate, deletedMessage) => {
      this.configuration.socketIO.emit("messageServerDelete", {
        username,
        userstate,
        deletedMessage
      });
    });
  }
  private async initOnMessageEvents() {
    this.handlers.clientTmi.onMessageEvent(async (channel, userstate, message, self) => {
      const userData = this.getUserStateInfo(userstate, self);
      messageLogger.info(`${userData.username}: ${message}`);

      const user = await createUserIfNotExist({ twitchId: userData.twitchId }, userData);

      if (!user) return;

      await this.handleSocketMessageServerEmit(user, {
        message,
        id: userstate.id || randomUUID(),
        emotes: userstate.emotes,
        timestamp: Number(userstate["tmi-sent-ts"]) || new Date().getTime()
      });

      await this.handlers.messagesHandler.saveMessageAndUpdateUser(user._id, user.username, new Date(), {
        emotes: !!userstate.emotes,
        message
      });

      // we can't use self - onMessageEvenet uses client for only receiving data. more see in TwitchTmiHandler
      if (userstate.username === botUsername) return;

      await this.chceckAndSendAnswer(user, message);
    });
  }

  private async handleSocketMessageServerEmit(
    { displayBadges, username, _id }: UserModel,
    messageData: MessageServerDataMessageDataType
  ) {
    const badgesPaths = await this.getUserBadgesPathsForMessageServer(displayBadges);

    this.configuration.socketIO.emit("messageServer", {
      user: { username, _id, badgesPaths },
      messageData
    });
  }

  private async getUserBadgesPathsForMessageServer(displayBadges: UserModel["displayBadges"]) {
    const foundBadges =
      displayBadges && displayBadges.length > 0 ? await getBadges({ _id: { $in: displayBadges } }, {}) : [];
    const badgesPaths: MessageServerDataBadgesPathsType = ["", "", ""];
    foundBadges?.forEach(({ imagesUrls: { x32 } }, index) => (badgesPaths[index] = x32));

    return badgesPaths;
  }

  private async chceckAndSendAnswer(user: UserModel, message: string) {
    const commandMessage = await this.handlers.commandsHandler.checkMessageForCommand(user, message);
    if (commandMessage) {
      if (typeof commandMessage === "string") {
        this.handlers.clientTmi.say(commandMessage);
      }
      ``;
      return;
    }

    //either check for timer / trigger / random message
    const messagesQueue = (
      await Promise.all([
        this.handlers.triggersHandler.checkMessageForTrigger(message),
        this.handlers.timersHandler.checkMessageForTimer(user)
      ])
    ).filter((x) => x) as string[];

    this.sendMessagesFromQueue(messagesQueue);
  }

  private sendMessagesFromQueue(messages: string[]) {
    const { min, max } = this.configuration.configs.headConfigs.delayBetweenMessages;
    messages.forEach((msgInQue, index) => {
      const delay = (index + 1) * Math.floor(Math.random() * (max - min + 1) + min);

      headLogger.info(`Send message ${msgInQue} in ${delay}ms`);
      setTimeout(() => {
        this.handlers.clientTmi.say(msgInQue);
      }, delay);
    });
  }
  // private async debugFollows() {
  //   const follows = await this.configuration.twitchApi.users.getFollows({
  //     followedUser: 147192097,
  //     limit: 100,
  //   });
  //   await addFollowersTemp(follows.data);
  // }

  async refreshConfigs() {
    const refreshedConfigs = await getConfigs();
    if (refreshedConfigs) {
      this.configuration.configs = refreshedConfigs;
      const {
        commandsConfigs,
        pointsConfigs,
        loyaltyConfigs,
        triggersConfigs,
        timersConfigs,
        musicConfigs,
        headConfigs
      } = this.configuration.configs;

      this.handlers.messagesHandler.refreshConfigs(pointsConfigs);
      this.handlers.loyaltyHandler.refreshConfigs({
        ...pointsConfigs,
        ...loyaltyConfigs
      });

      this.handlers.triggersHandler.refreshConfigs(triggersConfigs);

      this.handlers.commandsHandler.refreshConfigs({
        ...commandsConfigs,
        permissionLevels: headConfigs.permissionLevels
      });

      this.handlers.timersHandler.refreshConfigs(timersConfigs);

      this.handlers.musicStreamHandler.refreshConfigs(musicConfigs);
      this.handlers.musicYTHandler.refreshConfigs(musicConfigs);
    }
  }

  private getUserStateInfo(userstate: ChatUserstate, self: boolean): UserCreateData {
    const twitchId = (self && botId) || userstate["user-id"] || "undefinedTwitchId";
    const userData = {
      username: userstate["display-name"] || "undefinedUsername",
      twitchName: userstate.username || "undefinedTwitchName",
      twitchId: twitchId
    };
    return userData;
  }

  private initSocketEvents() {
    this.configuration.socketIO.on("connect", (socket) => {
      socket.emit("sendLoggedUserInfo", this.loggedIn ? this.configuration.authorizedUser.name : "");

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
        this.handlers.clientTmi.say(message);
      });

      this.onmusicStreamHandlerEvents(socket);

      this.onMusicYtHandlerEvents(socket);
    });
  }

  private async logoutUser() {
    await Promise.all([
      removeAuthToken(),
      this.handlers.eventSubHandler.stop(),
      this.handlers.clientTmi.disconnectTmi()
    ]);
    this.handlers.loyaltyHandler.stopCheckChatters();
    this.loggedIn = false;
  }

  private async onCreateCustomReward(data: CustomRewardCreateData) {
    if (!data.title || data.cost < 0) return false;
    try {
      await this.configuration.twitchApi.channelPoints.createCustomReward(this.configuration.authorizedUser.id, {
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
      await this.configuration.twitchApi.channelPoints.deleteCustomReward(this.configuration.authorizedUser.id, id);
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
      await this.configuration.twitchApi.channelPoints.updateCustomReward(this.configuration.authorizedUser.id, id, {
        ...data,
        title: title
      });
      return true;
    } catch (err) {
      headLogger.error(`Error occured while updating custom reward: ${err}`);

      return false;
    }
  }

  private async onGetCustomRewards() {
    const rewards = await this.configuration.twitchApi.channelPoints.getCustomRewards(
      this.configuration.authorizedUser.id
    );
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
    this.configuration.socketIO.emit("getCustomRewards", customRewardsData);
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
      this.handlers.triggersHandler.refreshTriggers(),
      this.handlers.commandsHandler.refreshCommands(),
      this.handlers.timersHandler.refreshTimers()
    ]);
  }

  private async onRefreshTriggers() {
    headLogger.info("Client created/updated/deleted trigger - refreshing triggers");
    await this.handlers.triggersHandler.refreshTriggers();
  }
  private async onRefreshCommands() {
    headLogger.info("Client created/updated/deleted command - refreshing commands");
    await this.handlers.commandsHandler.refreshCommands();
  }

  private async onRefreshTimers() {
    headLogger.info("Client created/updated/deleted timer - refreshing timers");
    await this.handlers.timersHandler.refreshTimers();
  }

  private onmusicStreamHandlerEvents(
    socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  ) {
    socket.on("getAudioStreamData", (cb) => {
      const audioData = this.handlers.musicStreamHandler.getAudioStreamData();
      const isPlaying = this.handlers.musicStreamHandler.isMusicPlaying();
      if (!audioData) return;
      cb(isPlaying, audioData);
    });

    socket.on("musicPause", () => {
      this.handlers.musicStreamHandler.pausePlayer();
    });

    socket.on("musicStop", () => {
      console.log("Add soon");
      //TODO: add music stop
    });

    socket.on("musicPlay", () => {
      this.handlers.musicStreamHandler.resumePlayer();
    });
    socket.on("loadSongs", (folderName) => {
      this.handlers.musicStreamHandler.loadNewSongs(folderName, true);
    });

    socket.on("musicNext", () => {
      this.handlers.musicStreamHandler.nextSong();
    });

    socket.on("changeVolume", (volume) => {
      this.handlers.musicStreamHandler.changeVolume(volume);
    });

    socket.on("getAudioInfo", () => {
      const audioInfo = this.handlers.musicStreamHandler.getAudioInfo();
      if (!audioInfo) return;

      this.configuration.socketIO.to(socket.id).emit("getAudioInfo", audioInfo);
    });
  }

  private onMusicYtHandlerEvents(
    socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  ) {
    socket.on("getAudioYTData", (cb) => {
      const audioData = this.handlers.musicYTHandler.getAudioStreamData();
      const isPlaying = this.handlers.musicYTHandler.isMusicPlaying();
      if (!audioData) return;
      cb(isPlaying, audioData);
    });
    socket.on("getAudioYTInfo", (cb) => {
      const audioData = this.handlers.musicYTHandler.getAudioInfo();
      if (!audioData) return;
      cb(audioData);
    });

    socket.on("musicYTPause", () => {
      this.handlers.musicYTHandler.pausePlayer();
    });

    socket.on("musicYTStop", () => {
      console.log("Add soon");
      //TODO: add music stop
    });

    socket.on("musicYTPlay", () => {
      this.handlers.musicYTHandler.resumePlayer();
    });

    //TODO: events from backend database?
    // socket.on('loadYTPlaylist', async (playlistId: string) => {
    //   await this.handlers.musicYTHandler.loadNewSongs('xd', true)
    // })

    socket.on("musicYTNext", () => {
      this.handlers.musicYTHandler.nextSong();
    });

    socket.on("changeYTVolume", (volume) => {
      this.handlers.musicYTHandler.changeVolume(volume);
    });
  }

  async checkCountOfViewers(broadcasterId: string) {
    const currentSession = await getCurrentStreamSession({});
    const streamInfo = await retryWithCatch(() =>
      this.configuration.twitchApi.streams.getStreamByUserId(broadcasterId)
    );

    if (!currentSession || !streamInfo) return;

    const viewersPeek = new Map<string, number>();
    viewersPeek.set(String(new Date().getTime()), streamInfo.viewers);
    const timestamp = Date.now();

    updateStreamSessionById(currentSession.id, {
      $set: { [`viewers.${timestamp}`]: streamInfo.viewers }
    });
  }
}

export default StreamHandler;

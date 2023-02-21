import { ApiClient } from "@twurple/api";
import { IConfigDocument, ITriggerDocument, IUser } from "@models/types";
import { Trigger } from "@models/trigger.model";
import { percentChance, randomWithMax } from "@utils/random-numbers.util";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@libs/types";
import removeDifferenceFromSet from "@utils/remove-difference-set.util";
import retryWithCatch from "@utils/retry-with-catch.util";

import {
  createUserIfNotExist,
  getTwitchNames,
  isUserInDB,
  updateUser,
} from "@services/User/";
import { createMessage } from "@services/Message";
import {
  getAllChatCommands,
  getChatCommands,
  getOneChatCommand,
} from "@services/ChatCommand";

interface BotStatsticOptions {
  config: IConfigDocument;
  twitchApi: ApiClient;
  socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
}

class BotStatisticDatabase {
  private config: IConfigDocument;
  private commandsWords: string[];
  private twitchApi: ApiClient;
  private triggerWords: string[];
  private triggersOnDelay: Map<string, NodeJS.Timeout>;
  private socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

  constructor(options: BotStatsticOptions) {
    const { twitchApi, config, socketIO } = options;
    this.twitchApi = twitchApi;
    this.config = config;
    this.commandsWords = [];
    this.triggerWords = [];
    this.triggersOnDelay = new Map();
    this.socketIO = socketIO;
  }

  public async init() {
    const broadcasterId = (await this.twitchApi.users.getMe()).id;

    setInterval(async () => {
      await this.checkChatters(broadcasterId);
    }, this.config.intervalCheckChatters);

    await this.getAllTrigersWordsFromDB();
    await this.getAllCommandWords();
  }

  async checkChatters(broadcasterId: string) {
    let usersBefore = new Set<string>();
    const usersNow = new Set<string>();
    const listOfChatters = await this.twitchApi.chat.getChatters(
      broadcasterId,
      broadcasterId
    );
    const { data } = listOfChatters;

    // loop through all chatters visible by api
    for await (const user of data) {
      const { userName, userDisplayName, userId } = user;

      usersNow.add(userName);
      //if users exist emit event
      // const userDB = await this.isUserInDB(userName);
      const userDB = await createUserIfNotExist(
        { twitchName: userName },
        {
          username: userDisplayName,
          twitchId: userId,
          twitchName: userName,
          privileges: 0,
        }
      );
      if (!usersBefore.has(userName) && userDB) {
        this.socketIO.emit(
          "userJoinTwitchChat",
          { eventDate: new Date(), eventName: "Join chat" },
          userDB
        );
      }

      usersBefore.add(userName);
    }
    removeDifferenceFromSet(usersBefore, usersNow);

    //after remove difference of sets loop on users that have been and emit left chat
    for await (const userLeft of usersBefore) {
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
    usersBefore = usersNow;
    usersNow.clear();
  }

  async updateEveryUserTwitchDetails(broadcasterId: string) {
    const limit = 50;
    let index = 0;

    const checkUsersTimer = setInterval(async () => {
      const usernames = await getTwitchNames(limit, limit * index);

      const usersTwitch = await retryWithCatch(() =>
        this.twitchApi.users.getUsersByNames(usernames.twitchNames)
      );
      if (!usersTwitch) return;

      for await (const user of usersTwitch) {
        // const follower = await retryWithCatch(async () => {
        //   for await (const user of usersTwitch) {
        //     await user.getFollowTo(broadcasterId);
        //   }
        // });
        //   user.follower = follower?.followDate;
        //   await user.save();
        console.log("user", user.displayName);
      }

      index++;
      if (limit * index > usernames.total) {
        console.log("Finished checking users - clear interval");
        clearInterval(checkUsersTimer);
      }
    }, 10000);
  }

  async getAllTrigersWordsFromDB() {
    const triggers = await Trigger.find();
    for (const index in triggers) {
      this.triggerWords = this.triggerWords.concat(triggers[index].words);
    }
  }

  async checkMessageToTriggerWord(message: string) {
    for (const index in this.triggerWords) {
      const trigger = this.triggerWords[index];
      if (!message.includes(trigger)) continue;

      return await this.getTriggerByTriggerWord(trigger);
    }
  }

  async getTriggerByTriggerWord(trigger: string) {
    const foundTrigger = await Trigger.findOne({ words: { $all: trigger } });

    if (!foundTrigger || !percentChance(foundTrigger.chance)) return false;

    foundTrigger.onDelay = true;
    await foundTrigger.save();

    if (foundTrigger.onDelay && !this.triggersOnDelay.has(foundTrigger.name)) {
      //If trigger is on delay and Timeout is not set do
      await this.setTimeoutRefreshTrigerDelay(foundTrigger);

      return foundTrigger.messages[randomWithMax(foundTrigger.messages.length)];
    }
  }

  async setTimeoutRefreshTrigerDelay(trigger: ITriggerDocument) {
    this.triggersOnDelay.set(
      trigger.name,
      setTimeout(async () => {
        trigger.onDelay = false;
        await trigger.save();

        this.triggersOnDelay.delete(trigger.name);
        console.log(`${trigger.name} - is now turn on again!`);
      }, trigger.delay * 1000)
    );
  }

  async saveMessageToDatabase(senderId: string, message: string) {
    try {
      const newMessage = await createMessage({
        message: message,
        date: new Date(),
        owner: senderId,
      });
    } catch (err) {
      //TODO: logs to file
      // message to file
      console.log("Couldnt save message");
    }
  }

  async updateUserStatistics(userId: string) {
    const pointsIncrement = 1;

    const updateData = {
      $inc: { points: pointsIncrement, messageCount: 1 },
      // add points by message,       count messages
      $set: { lastSeen: new Date() },
      // set last seen to new Date()
    };

    await updateUser({ _id: userId }, updateData);
  }

  async checkMessageForCommand(user: IUser, message: string) {
    if (!message.startsWith(this.config.commandsPrefix)) return false;

    let foundCommand = null;

    for (const index in this.commandsWords) {
      const aliasCommand = this.commandsWords[index];
      if (!message.includes(aliasCommand)) continue;

      foundCommand = await getOneChatCommand({
        aliases: { $all: aliasCommand },
      });

      if (!foundCommand) return;
      if (user.privileges < foundCommand.privilege) return;

      foundCommand.useCount++;
      await foundCommand.save();

      return this.formatCommandMessage(user, foundCommand.messages[0]);
    }
    if (!foundCommand) return await this.notFoundCommand();
  }

  formatCommandMessage(user: IUser, message?: string) {
    let formatMsg = message || "";

    let matches = formatMsg.match(/\{(.*?)\}/);

    while (matches !== null) {
      const userDetail = this.formatUserDetail(user[matches[1] as keyof IUser]);
      formatMsg = formatMsg.replace(matches[0], userDetail);

      matches = formatMsg.match(/\{(.*?)\}/);
    }

    return formatMsg;
  }

  formatUserDetail(detail: any) {
    if (typeof detail === "number") return detail.toLocaleString();
    else if (detail instanceof Date) return detail.toLocaleString();

    return detail;
  }

  async getAllCommandWords() {
    const commands = await getAllChatCommands();
    for (const index in commands) {
      this.commandsWords = this.commandsWords.concat(commands[index].aliases);
    }
  }

  async notFoundCommand() {
    //Hard codded
    let notFoundCommandMessage = "Not found command. Most used commands are:";

    const mostUsedCommands = await getChatCommands(
      {},
      { limit: 5, sort: { useCount: -1 }, select: { aliases: 1 } }
    );

    mostUsedCommands.forEach((command) => {
      notFoundCommandMessage += ` [${command.aliases.join(", ")}]`;
    });

    return notFoundCommandMessage;
  }
}

export default BotStatisticDatabase;

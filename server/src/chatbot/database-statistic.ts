import { ObjectId } from "mongoose";
import { ApiClient } from "@twurple/api";
import { IConfigDocument, ITriggerDocument, IUser } from "@models/types";
import { Message } from "@models/message.model";
import { User } from "@models/user.model";
import { Trigger } from "@models/trigger.model";
import { percentChance, randomWithMax } from "@utils/random-numbers.util";
import { ChatCommand } from "@models/chat-command.model";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@libs/types";
import removeDifferenceFromSet from "@utils/remove-difference-set.util";

type userId = string | ObjectId;

class BotStatisticDatabase {
  config: IConfigDocument;
  commandsWords: string[];
  twitchApi: ApiClient;
  triggerWords: string[];
  triggersOnDelay: Map<string, NodeJS.Timeout>;
  socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

  constructor(
    twitchApi: ApiClient,
    config: IConfigDocument,
    socketIO: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >
  ) {
    this.twitchApi = twitchApi;
    this.config = config;
    this.commandsWords = [];
    this.triggerWords = [];
    this.triggersOnDelay = new Map();
    this.socketIO = socketIO;
  }

  public async init() {
    await this.checkChattersInterval();
    await this.updateEveryUserTwitchDetails();
    await this.getAllTrigersWordsFromDB();
    await this.getAllCommandWords();
  }

  async checkChattersInterval() {
    const broadcasterId = (await this.twitchApi.users.getMe()).id;
    let usersBefore = new Set<string>();
    setInterval(async () => {
      const usersNow = new Set<string>();
      const listOfChatters = await this.twitchApi.chat.getChatters(
        broadcasterId,
        broadcasterId
      );
      const { data } = listOfChatters;

      // loop through all chatters visible by api
      for await (const user of data) {
        const { userName } = user;

        usersNow.add(userName);
        //if users exist emit event
        const userDB = await this.isUserInDB(userName);
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
        const userDB = await this.isUserInDB(userLeft);
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
    }, 150000);
  }

  async updateEveryUserTwitchDetails() {
    const broadcasterId = (await this.twitchApi.users.getMe()).id;

    try {
      for await (const user of User.find()) {
        const userTwitch = await this.twitchApi.users.getUserByName(
          user.username
        );
        const follower = await userTwitch?.getFollowTo(broadcasterId);

        if (!userTwitch) return;

        user.twitchId = userTwitch.id;
        user.twitchName = userTwitch.name;
        user.follower = follower?.followDate;

        await user.save();
      }

      console.log("Finished checking users in twitch details");
    } catch (error) {
      console.log("Couldn't save twitch details ");
    }
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

  async saveMessageToDatabase(senderId: userId, message: string) {
    const newMessage = new Message({
      message: message,
      date: new Date(),
      owner: senderId,
    });
    try {
      newMessage.save();
    } catch (err) {
      console.log(
        "Couldnt save message. Anyway message should be saved in local file."
      );
    }
  }

  async isUserInDB(username: string) {
    const user = await User.findOne({ username: username });

    if (!user) {
      return await this.#createNewDBUser(username);
    } else {
      return user;
    }
  }

  async #createNewDBUser(username: string) {
    const newUser = new User({ username: username });
    try {
      await newUser.save();

      return newUser;
    } catch (err) {
      console.log("err", err);
      return false;
    }
  }

  async updateUserStatistics(userId: userId) {
    const pointsIncrement = 1;

    await User.findByIdAndUpdate(userId, {
      $inc: { points: pointsIncrement, messageCount: 1 },
      // add points by message,       count messages
      $set: { lastSeen: new Date() },
      // set last seen to new Date()
    });
  }

  async checkMessageForCommand(user: IUser, message: string) {
    if (!message.startsWith(this.config.commandsPrefix)) return false;

    let foundCommand = null;

    for (const index in this.commandsWords) {
      const aliasCommand = this.commandsWords[index];
      if (!message.includes(aliasCommand)) continue;

      foundCommand = await this.getCommandByAlias(aliasCommand);

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
    const commands = await ChatCommand.find();
    for (const index in commands) {
      this.commandsWords = this.commandsWords.concat(commands[index].aliases);
    }
  }

  async notFoundCommand() {
    //Hard codded
    let notFoundCommandMessage = "Not found command. Most used commands are:";

    const mostUsedCommands = await ChatCommand.find()
      .sort({ useCount: -1 })
      .select({ aliases: 1 })
      .limit(5);

    mostUsedCommands.forEach((command) => {
      notFoundCommandMessage += ` [${command.aliases.join(", ")}]`;
    });

    return notFoundCommandMessage;
  }

  async getCommandByAlias(alias: string) {
    return await ChatCommand.findOne({ aliases: { $all: alias } });
  }
}

export default BotStatisticDatabase;

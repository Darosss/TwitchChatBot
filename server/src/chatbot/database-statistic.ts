import { ObjectId } from "mongoose";
import { ApiClient } from "@twurple/api";
import { IUser } from "@models/types";
import { Message } from "@models/message.model";
import { User } from "@models/user.model";

type userId = string | ObjectId;

class BotStatisticDatabase {
  commandPrefix: string;
  twitchApi: ApiClient;

  constructor(twitchApi: ApiClient) {
    this.twitchApi = twitchApi;
    this.commandPrefix = "--";
    this.updateEveryUserTwitchDetails();
  }

  async updateEveryUserTwitchDetails() {
    const broadcasterId = (await this.twitchApi.users.getMe()).id;
    const users = await User.find({});
    try {
      for (let indx = 0; indx < users.length; indx++) {
        const userTwitch = await this.twitchApi.users.getUserByName(
          users[indx].username
        );
        const follower = await userTwitch?.getFollowTo(broadcasterId);

        await User.findByIdAndUpdate(users[indx].id, {
          twitchId: userTwitch?.id,
          twitchName: userTwitch?.name,
          follower: follower?.followDate,
        });
      }
      console.log("Finished checking users in twitch details");
    } catch (error) {
      console.log("Couldn't save twitch details ");
    }
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
    if (!message.startsWith(this.commandPrefix)) return false;
    let messageWithoutPrefix = message.slice(
      this.commandPrefix.length,
      message.length
    );

    switch (messageWithoutPrefix) {
      case "points": {
        message = `@${
          user.username
        }, your points: ${user.points.toLocaleString()}`;
        break;
      }
      case "messages" || "msgs": {
        message = `@${
          user.username
        }, your messages: ${user.messageCount.toLocaleString()}`;
        break;
      }
      case "commands": {
        message = `Available commands: (--points, --messages)`;
        break;
      }
      default:
        message = `Not found command. Check commands with: ${this.commandPrefix}commands`;
        break;
    }

    return message;
  }
}

export default BotStatisticDatabase;

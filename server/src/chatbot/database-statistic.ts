import { ObjectId } from "mongoose";
import { Message } from "../models/message.model";
import { IUser } from "../models/types";
import { User } from "../models/user.model";

type userId = string | ObjectId;

class BotStatisticDatabase {
  commandPrefix: string;
  constructor() {
    this.commandPrefix = "--";
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
      default:
        message = `Not found command. Check commands with: ${this.commandPrefix}commands`;
        break;
    }

    return message;
  }
}

export default BotStatisticDatabase;

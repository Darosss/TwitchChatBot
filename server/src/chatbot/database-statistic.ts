import { ObjectId } from "mongoose";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";

class BotStatisticDatabase {
  constructor() {}

  async saveMessageToDatabase(senderId: string | ObjectId, message: string) {
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

  async onMessageActions(userId: string | ObjectId) {
    const pointIncrement = 1;

    await User.findByIdAndUpdate(userId, {
      $inc: { points: pointIncrement, messageCount: 1 },
      // add points by message,       count messages
      $set: { lastSeen: new Date() },
      // set last seen to new Date()
    });
  }
}

export default BotStatisticDatabase;

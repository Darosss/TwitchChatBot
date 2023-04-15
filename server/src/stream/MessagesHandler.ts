import { createMessage } from "@services/messages";
import { MessageCreateData } from "@services/messages/types";
import { updateUser } from "@services/users";
import { PointsConfigs } from "@models/types";

class MessagesHandler {
  private configs: PointsConfigs;
  constructor(configs: PointsConfigs) {
    this.configs = configs;
  }

  public async refreshConfigs(refreshedConfigs: PointsConfigs) {
    this.configs = refreshedConfigs;
  }

  public async saveMessageAndUpdateUser(
    userId: string,
    userName: string,
    date: Date,
    message: string
  ) {
    await this.saveMessageToDatabase({
      owner: userId,
      ownerUsername: userName,
      date: date,
      message: message,
    });

    await this.updateUserStatistics(userId);
  }
  private async saveMessageToDatabase(messageCreateData: MessageCreateData) {
    try {
      const newMessage = await createMessage(messageCreateData);
    } catch (err) {}
  }

  private async updateUserStatistics(userId: string) {
    const updateData = {
      $inc: { points: this.configs.pointsIncrement.message, messageCount: 1 },
      // add points by message,       count messages
      $set: { lastSeen: new Date() },
      // set last seen to new Date()
    };

    await updateUser({ _id: userId }, updateData);
  }
}

export default MessagesHandler;

import { createMessage, MessageCreateData, updateUser } from "@services";
import { ConfigModel } from "@models";
import { ConfigManager } from "./ConfigManager";
import AchievementsHandler from "./AchievementsHandler";

class MessagesHandler {
  private configs: ConfigModel = ConfigManager.getInstance().getConfig();
  constructor() {
    ConfigManager.getInstance().registerObserver(this.handleConfigUpdate.bind(this));
  }

  private async handleConfigUpdate(newConfigs: ConfigModel) {
    this.configs = newConfigs;
  }

  public async saveMessageAndUpdateUser(
    userId: string,
    userName: string,
    date: Date,
    messageData: { message: string; emotes?: boolean }
  ) {
    await this.saveMessageToDatabase({
      owner: userId,
      ownerUsername: userName,
      date: date,
      message: messageData.message
    });
    AchievementsHandler.getInstance().checkMessageForAchievements({
      messageData,
      date,
      userId,
      username: userName
    });

    const updatedUser = await this.updateUserStatistics(userId);

    if (!updatedUser) return;
  }

  private async saveMessageToDatabase(messageCreateData: MessageCreateData) {
    try {
      const newMessage = await createMessage(messageCreateData);
      return newMessage;
    } catch (err) {
      console.error("Error occured when saving message into database", err);
    }
  }

  private async updateUserStatistics(userId: string) {
    const updateData = {
      $inc: { points: this.configs.pointsConfigs.pointsIncrement.message, messageCount: 1 },
      // add points by message,       count messages
      $set: { lastSeen: new Date() }
      // set last seen to new Date()
    };

    return await updateUser({ _id: userId }, updateData);
  }
}

export default MessagesHandler;

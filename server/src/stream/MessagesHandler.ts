import { createMessage, MessageCreateData, updateUser } from "@services";
import { PointsConfigs, UserModel } from "@models";
import AchievementsHandler from "./AchievementsHandler";
import { ACHIEVEMENTS } from "@defaults";

class MessagesHandler {
  private configs: PointsConfigs;
  private achievementsHandler: AchievementsHandler;
  constructor(achievementsHandler: AchievementsHandler, configs: PointsConfigs) {
    this.achievementsHandler = achievementsHandler;
    this.configs = configs;
  }

  public async refreshConfigs(refreshedConfigs: PointsConfigs) {
    this.configs = refreshedConfigs;
  }

  public async saveMessageAndUpdateUser(userId: string, userName: string, date: Date, message: string) {
    await this.saveMessageToDatabase({
      owner: userId,
      ownerUsername: userName,
      date: date,
      message: message
    });

    const updatedUser = await this.updateUserStatistics(userId);

    if (!updatedUser) return;
    this.checkAchievementsIfUserFirstMessage(updatedUser);
  }

  private async checkAchievementsIfUserFirstMessage(user: UserModel) {
    if (user.messageCount !== 1) return;

    await this.achievementsHandler.updateAchievementUserProgressAndAddToQueue({
      achievement: ACHIEVEMENTS.CHAT_MESSAGES,
      userId: user._id,
      progressValue: user.messageCount || 0,
      username: user.username
    });
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
      $inc: { points: this.configs.pointsIncrement.message, messageCount: 1 },
      // add points by message,       count messages
      $set: { lastSeen: new Date() }
      // set last seen to new Date()
    };

    return await updateUser({ _id: userId }, updateData);
  }
}

export default MessagesHandler;

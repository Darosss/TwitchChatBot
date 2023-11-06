import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  ObtainAchievementData
} from "@socket";
import { Server } from "socket.io";
import QueueHandler from "./QueueHandler";
import {
  getDataForObtainAchievementEmit,
  updateAchievementUserProgressProgresses,
  UpdateAchievementUserProgressProgressesReturnData,
  GetDataForObtainAchievementEmitReturnData,
  UpdateAchievementUserProgressProgressesArgs
} from "@services";
import { ACHIEVEMENTS, POLISH_SWEARING } from "@defaults";
import { achievementsLogger } from "@utils";

interface CheckMessageForAchievement {
  message: string;
  date: Date;
  userId: string;
  username: string;
}

interface CheckMessageForAchievementWithCondition extends Pick<CheckMessageForAchievement, "userId" | "username"> {
  condition: boolean;
  achievementName: ACHIEVEMENTS;
}

interface UpdateAchievementUserProgressOpts extends UpdateAchievementUserProgressProgressesArgs {
  username: string;
}

class AchievementsHandler extends QueueHandler<ObtainAchievementData> {
  private socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  constructor(socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
    super();
    this.socketIO = socketIO;
  }

  protected override startInterval(): void {
    super.startInterval((item) => {
      this.emitObtainAchievement(item);
    });
  }

  public override enqueue(item: ObtainAchievementData) {
    super.enqueue(item);

    this.startInterval();
  }

  private convertUpdateDataToObtainAchievementData(data: UpdateAchievementUserProgressProgressesReturnData) {
    const nowFinishedStagesInfo = getDataForObtainAchievementEmit({
      foundAchievement: data.foundAchievement,
      nowFinishedStages: data.nowFinishedStages
    });

    return nowFinishedStagesInfo;
  }

  public async updateAchievementUserProgressAndAddToQueue({ username, ...rest }: UpdateAchievementUserProgressOpts) {
    const updateData = await updateAchievementUserProgressProgresses(rest);

    if (!updateData) {
      achievementsLogger.error("Not found update data in updateAchievementUserProgressAndAddToQueue");
      return;
    }

    const modifiedUpdateData = this.convertUpdateDataToObtainAchievementData(updateData);

    this.addObtainedAchievementDataToQueue(modifiedUpdateData, username);
  }

  private addObtainedAchievementDataToQueue(data: GetDataForObtainAchievementEmitReturnData, username: string) {
    data.stages.forEach((stage) => this.enqueue({ achievementName: data.achievementName, stage, username }));
  }

  private emitObtainAchievement({ achievementName, stage, username }: ObtainAchievementData) {
    this.socketIO.emit("obtainAchievement", { achievementName: achievementName, stage, username });
  }

  public async checkMessageForAchievements({ message, ...data }: CheckMessageForAchievement) {
    const checkMessageForConditionWithData = async (condition: boolean, achievementName: ACHIEVEMENTS) =>
      await this.checkMessageForAchievementWithCondition({ ...data, condition, achievementName });

    const lowerCaseMessage = message.toLowerCase();
    await checkMessageForConditionWithData(true, ACHIEVEMENTS.CHAT_MESSAGES);
    await checkMessageForConditionWithData(message.includes("."), ACHIEVEMENTS.DOTS);
    await checkMessageForConditionWithData(message.includes("?"), ACHIEVEMENTS.QUESTION_MARKS);
    await checkMessageForConditionWithData(message.includes("!"), ACHIEVEMENTS.DICTATOR);
    await checkMessageForConditionWithData(message.includes(","), ACHIEVEMENTS.COMMAS);
    await checkMessageForConditionWithData(message.includes("@"), ACHIEVEMENTS.MONKEY);
    await checkMessageForConditionWithData(message.length > 25, ACHIEVEMENTS.LONG_MESSAGES);
    await checkMessageForConditionWithData(message.length < 4, ACHIEVEMENTS.SHORT_MESSAGES);
    await checkMessageForConditionWithData(message.includes("xd"), ACHIEVEMENTS.XD);
    await checkMessageForConditionWithData(message.includes("Kappa"), ACHIEVEMENTS.KAPPA);
    await checkMessageForConditionWithData(message.includes("LUL"), ACHIEVEMENTS.LUL);
    await checkMessageForConditionWithData(
      this.isMessageContaingPolishSwearing(lowerCaseMessage),
      ACHIEVEMENTS.POLISH_SWEARING
    );
  }

  private isMessageContaingPolishSwearing(lowercaseMessage: string) {
    for (const swearing in POLISH_SWEARING) {
      console.log(swearing.toLowerCase(), lowercaseMessage, "c do chuja");
      if (lowercaseMessage.includes(swearing.toLowerCase())) return true;
    }
    return false;
  }

  private async checkMessageForAchievementWithCondition({
    condition,
    achievementName,
    userId,
    username
  }: CheckMessageForAchievementWithCondition) {
    if (!condition) return;

    await this.updateAchievementUserProgressAndAddToQueue({
      achievementName,
      userId,
      username,
      progress: { increment: true, value: 1 }
    });
  }
}

export default AchievementsHandler;

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
  GetDataForObtainAchievementEmitReturnData
} from "@services";
import { ACHIEVEMENTS } from "@defaults";
import { achievementsLogger } from "@utils";

interface UpdateAchievementUserProgressOpts {
  achievement: ACHIEVEMENTS;
  progressValue: number;
  userId: string;
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

  public async updateAchievementUserProgressAndAddToQueue({
    achievement,
    userId,
    progressValue,
    username
  }: UpdateAchievementUserProgressOpts) {
    const updateData = await updateAchievementUserProgressProgresses(achievement, userId, progressValue);

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
}

export default AchievementsHandler;

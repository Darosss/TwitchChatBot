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
  UpdateAchievementUserProgressProgressesArgs,
  getAchievements,
  updateUserById,
  getAchievementUserProgresses
} from "@services";
import { ACHIEVEMENTS } from "@defaults";
import { achievementsLogger, getDateFromSecondsToYMDHMS } from "@utils";
import moment from "moment";
import { randomUUID } from "crypto";
import {
  AchievementCustomModel,
  AchievementModel,
  AchievementUserProgressModel,
  AchievementsConfigs,
  BadgeModel,
  CustomAchievementAction,
  TagModel,
  UserModel
} from "@models";
import { client as discordClient, sendMessageInChannelByChannelId } from "../discord";
import { codeBlock } from "discord.js";
// TODO: PERFOMANCE
// TODO: cache custom achievements names or _ids
// TODO: cache basic achievements too maybe
// TODO: add on refresh tag, achievement itd, refresh of these in cache

interface CommonAchievementCheckType {
  userId: string;
  username: string;
}

interface CheckMessageForAchievement extends CommonAchievementCheckType {
  message: string;
  date: Date;
}

interface CheckWatchTimeForAchievement extends CommonAchievementCheckType {
  progress: number;
}

interface CheckMessageForAchievementWithCondition extends Pick<CheckMessageForAchievement, "userId" | "username"> {
  condition: boolean;
  achievementName: ACHIEVEMENTS;
}

interface UpdateAchievementUserProgressOpts extends UpdateAchievementUserProgressProgressesArgs {
  username: string;
}
type CheckGlobalUserDetailsArgs = Omit<UpdateAchievementUserProgressOpts, "achievementName">;

interface CheckGlobalUserDetailsDateArgs extends Omit<CheckGlobalUserDetailsArgs, "progress"> {
  dateProgress: Date;
}

type IncrementCommandAchievementsArgs = Pick<CheckMessageForAchievement, "userId" | "username">;

class AchievementsHandler extends QueueHandler<ObtainAchievementData> {
  private socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  private configs: AchievementsConfigs;
  constructor(
    socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    configs: AchievementsConfigs
  ) {
    super();
    this.socketIO = socketIO;
    this.onEmulateAchievementSocket();
    this.configs = configs;
  }

  protected override startTimeout(delay = 0): void {
    super.startTimeout(delay, (item) => {
      this.emitObtainAchievement(item);

      this.socketIO.emit("obtainAchievementQueueInfo", this.getItemsCountInQueue());
      this.handleDiscordAnnoucment(item);
      this.startTimeout(item.stage[0].showTimeMs + 1000);
    });
  }

  private async handleDiscordAnnoucment(item: ObtainAchievementData) {
    if (this.configs.obtainedAchievementsChannelId) {
      const messageToSend = this.getDiscordAchievementMessage(item);
      sendMessageInChannelByChannelId(discordClient, this.configs.obtainedAchievementsChannelId, messageToSend);
    }
  }

  private getDiscordAchievementMessage({
    username,
    stage: [stage, stageTimestamp],
    achievement
  }: ObtainAchievementData) {
    return codeBlock(
      "js",
      `${moment(stageTimestamp).format("DD-MM-YYYY HH:MM:ss")}\nUser: "${username}" - obtained achievement ${
        achievement.name
      }\nName: '${stage.name}'\nGoal: ${
        achievement.isTime ? `'${getDateFromSecondsToYMDHMS(stage.goal).trim()}'` : stage.goal
      }\nBadge: '${stage.badge.name}'`
    );
  }

  public override enqueue(item: ObtainAchievementData) {
    super.enqueue(item);

    this.startTimeout(500);
  }

  private convertUpdateDataToObtainAchievementData(data: UpdateAchievementUserProgressProgressesReturnData) {
    const nowFinishedStagesInfo = getDataForObtainAchievementEmit({
      foundAchievement: data.foundAchievement,
      nowFinishedStages: data.nowFinishedStages
    });

    return nowFinishedStagesInfo;
  }

  private async updateAchievementUserProgressAndAddToQueue({ username, ...rest }: UpdateAchievementUserProgressOpts) {
    const updateData = await updateAchievementUserProgressProgresses(rest);

    if (!updateData) {
      achievementsLogger.error("Not found update data in updateAchievementUserProgressAndAddToQueue");
      return;
    }

    const modifiedUpdateData = this.convertUpdateDataToObtainAchievementData(updateData);

    if (modifiedUpdateData.stages.length > 0) this.addObtainedAchievementDataToQueue(modifiedUpdateData, username);
  }

  private addObtainedAchievementDataToQueue(data: GetDataForObtainAchievementEmitReturnData, username: string) {
    data.stages.forEach((stage) =>
      this.enqueue({
        achievement: data.achievement,
        stage,
        username,
        id: randomUUID()
      })
    );
  }

  private onEmulateAchievementSocket() {
    this.socketIO.on("connect", (socket) => {
      socket.on("emulateAchievement", (data) => {
        this.enqueue(data);
      });
    });
  }

  private emitObtainAchievement(emitData: ObtainAchievementData) {
    this.socketIO.emit("obtainAchievement", emitData);
  }

  public async checkMessageForAchievements({ message, ...data }: CheckMessageForAchievement) {
    await this.checkCustomMessageAchievements({ message, ...data });

    await this.checkMessageForAchievementWithCondition({
      ...data,
      condition: true,
      achievementName: ACHIEVEMENTS.CHAT_MESSAGES
    });
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

  public async checkOnlineUserAchievements(user: UserModel) {
    const { _id, username, messageCount, watchTime, points, follower } = user;
    const commonData = { userId: _id, username: username };
    await this.updateAchievementUserProgressAndAddToQueue({
      ...commonData,
      achievementName: ACHIEVEMENTS.CHAT_MESSAGES,
      progress: { value: messageCount || 0 }
    });
    await this.updateAchievementUserProgressAndAddToQueue({
      ...commonData,
      achievementName: ACHIEVEMENTS.WATCH_TIME,
      progress: { value: watchTime || 0 }
    });
    await this.updateAchievementUserProgressAndAddToQueue({
      ...commonData,
      achievementName: ACHIEVEMENTS.POINTS,
      progress: { value: points || 0 }
    });
    if (follower) {
      await this.checkUserFollowageForAchievement({ ...commonData, dateProgress: follower });
    }

    await this.handleBadgesLogic(commonData);

    await this.checkCustomWatchTimeAchievements({ ...commonData, progress: watchTime || 0 });
  }

  private async checkUserFollowageForAchievement({ dateProgress, ...rest }: CheckGlobalUserDetailsDateArgs) {
    const daysFollow = moment().diff(moment(dateProgress), "seconds");
    await this.updateAchievementUserProgressAndAddToQueue({
      achievementName: ACHIEVEMENTS.FOLLOWAGE,
      progress: { value: daysFollow },
      ...rest
    });
  }

  public async incrementCommandAchievements(args: IncrementCommandAchievementsArgs) {
    await this.checkMessageForAchievementWithCondition({
      achievementName: ACHIEVEMENTS.COMMANDS_COUNT,
      condition: true,
      ...args
    });
  }

  public async incrementMusicLikesCommandAchievements(args: IncrementCommandAchievementsArgs) {
    await this.checkMessageForAchievementWithCondition({
      achievementName: ACHIEVEMENTS.SONG_VOTING,
      condition: true,
      ...args
    });
  }

  public async incrementMusicSongRequestCommandAchievements(args: IncrementCommandAchievementsArgs) {
    await this.checkMessageForAchievementWithCondition({
      achievementName: ACHIEVEMENTS.SONG_REQUEST,
      condition: true,
      ...args
    });
  }

  private async checkCustomMessageAchievements(data: CheckMessageForAchievement) {
    const foundCustomMessageAchievements = await getAchievements(
      { enabled: true, custom: { $exists: true }, isTime: false },
      {},
      { tag: true }
    );

    if (!foundCustomMessageAchievements)
      return achievementsLogger.info("Not found any custom message achievements in checkCustomMessageAchievements");
    for await (const achievement of foundCustomMessageAchievements.filter(
      (achivementFilter) => (achivementFilter.tag as TagModel).enabled
    )) {
      const { name, custom } = achievement;

      const condition = this.checkAchievementDependsOnMessageAction(custom, data.message);
      if (condition) {
        await this.updateAchievementUserProgressAndAddToQueue({
          ...data,
          achievementName: name,
          progress: {
            increment: true,
            value: 1
          }
        });
      }
    }
  }

  private checkAchievementDependsOnMessageAction(
    { action, numberValue, stringValues, caseSensitive }: AchievementCustomModel,
    message: string
  ) {
    const messageToCheck = !caseSensitive ? message.toLowerCase() : message;
    const messageLength = messageToCheck.length;
    const stringValuesToCheck = !caseSensitive ? stringValues?.map((val) => val.toLowerCase()) : stringValues;
    switch (action) {
      case CustomAchievementAction.ALL:
        return true;

      case CustomAchievementAction.MESSAGE_GT:
        return numberValue && messageLength > numberValue;

      case CustomAchievementAction.MESSAGE_LT:
        return numberValue && messageLength < numberValue;

      case CustomAchievementAction.INCLUDES:
        return stringValuesToCheck?.some((val) => messageToCheck.includes(val));

      case CustomAchievementAction.STARTS_WITH:
        return stringValuesToCheck?.some((val) => messageToCheck.startsWith(val));

      case CustomAchievementAction.ENDS_WITH:
        return stringValuesToCheck?.some((val) => messageToCheck.endsWith(val));

      //do not check watch time there.
      case CustomAchievementAction.WATCH_TIME:
      default:
        return;
    }
  }

  private async checkCustomWatchTimeAchievements(data: CheckWatchTimeForAchievement) {
    //TODO: think about custom  achievemnt depends on date
    const foundCustomWatchTimeAchievements = await getAchievements(
      { enabled: true, custom: { $exists: true }, isTime: true },
      {},
      { tag: true }
    );
    if (!foundCustomWatchTimeAchievements)
      return achievementsLogger.info("Not found any custom message achievements in checkCustomWatchTimeAchievements");
    for (const achievement of foundCustomWatchTimeAchievements.filter(
      (achivementFilter) => (achivementFilter.tag as TagModel).enabled
    )) {
      const {
        name,
        custom: { action }
      } = achievement;

      if (action !== CustomAchievementAction.WATCH_TIME) return;

      await this.updateAchievementUserProgressAndAddToQueue({
        ...data,
        achievementName: name,
        progress: {
          increment: true,
          value: 1
        }
      });
    }
  }

  private async handleBadgesLogic(data: CommonAchievementCheckType) {
    const progresses = await getAchievementUserProgresses(
      { userId: data.userId, progressesLength: { $gt: 0 } },
      { populate: { achievements: { value: true, stages: { value: true, badges: true } } } }
    );

    if (!progresses) return;
    await this.updateUsersDisplayBadgesDependsOnRarity(data.userId, progresses);
    await this.setBadgesAchievementCount(data, progresses);
  }

  private async setBadgesAchievementCount(
    data: CommonAchievementCheckType,
    progresses: AchievementUserProgressModel[]
  ) {
    const earnedBadgesCount = progresses.reduce(
      (badgesCount, { progressesLength }) => badgesCount + progressesLength,
      0
    );
    await this.updateAchievementUserProgressAndAddToQueue({
      ...data,
      achievementName: ACHIEVEMENTS.BADGES_COUNT,
      progress: { value: earnedBadgesCount }
    });
  }

  // note:
  // for now I create dynamical choose badges.
  // latter it should be changeable by twitch command / discord command
  private async updateUsersDisplayBadgesDependsOnRarity(userId: string, progresses: AchievementUserProgressModel[]) {
    const bestBadges = progresses
      .map((progress) => {
        const lastProgress = progress.progresses.slice(-1)[0];
        const achievement = <AchievementModel<BadgeModel>>progress.achievement;
        const stageData = achievement.stages.stageData.find((stageData) => stageData.stage === lastProgress[0]);

        return { rarity: stageData?.rarity || 1, badge: stageData?.badge._id || "" };
      })
      .sort((a, b) => b.rarity - a.rarity)
      .slice(0, 3);

    //if there are any get 3 most rariry badges

    await updateUserById(userId, {
      displayBadges: [bestBadges.at(0)?.badge, bestBadges.at(1)?.badge, bestBadges.at(2)?.badge]
    });
  }
}

export default AchievementsHandler;

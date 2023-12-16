import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
  isObtainedAchievement
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
  getAchievementUserProgresses,
  getOneAchievement,
  getCurrentStreamSession
} from "@services";
import { ACHIEVEMENTS } from "@defaults";
import { achievementsLogger, getDateFromSecondsToYMDHMS, percentChance } from "@utils";
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
import { SubscriptionTiers } from "./EventSubHandler";
// TODO: PERFOMANCE
// TODO: cache custom achievements names or _ids
// TODO: cache basic achievements too maybe
// TODO: add on refresh tag, achievement itd, refresh of these in cache

interface CommonAchievementCheckType {
  userId: string;
  username: string;
}

interface CheckMessageForAchievement extends CommonAchievementCheckType {
  messageData: {
    message: string;
    emotes?: boolean;
  };
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

type UpdateAchievementUserProgressReturn = { error: false } | { error: true; message: string };

type CheckGlobalUserDetailsArgs = Omit<UpdateAchievementUserProgressOpts, "achievementName">;

interface CheckGlobalUserDetailsDateArgs extends Omit<CheckGlobalUserDetailsArgs, "progress"> {
  dateProgress: Date;
}

interface CheckUserSubscribeForAchievementsParams extends Omit<CheckGlobalUserDetailsArgs, "progress"> {
  tier: SubscriptionTiers;
  isGift: boolean;
}
//TODO: refactor names to params

interface CheckUserSubscribeGiftsForAchievementsParams extends Omit<CheckGlobalUserDetailsArgs, "progress"> {
  tier: SubscriptionTiers;
  amount: number;
  isAnonymous: boolean;
}
type IncrementCommandAchievementsArgs = Pick<CheckMessageForAchievement, "userId" | "username">;

interface AddAchievementProgressDataToQueueData
  extends Omit<GetDataForObtainAchievementEmitReturnData, "stages" | "gainedProgress"> {
  gainedProgress: ObtainAchievementDataWithProgressOnly["progressData"];
}

interface AddAnonymousAchievementProgressData {
  achievementName: ACHIEVEMENTS;
  username: string;
  gainedProgress: AddAchievementProgressDataToQueueData["gainedProgress"];
}

interface CheckRaidFromForAchievementsParams extends CommonAchievementCheckType {
  viewersAmount: number;
}
interface CheckUserCheersForAchievementsParams extends Partial<CommonAchievementCheckType> {
  isAnonymous: boolean;
  bits: number;
  message: string;
}

class AchievementsHandler extends QueueHandler<
  ObtainAchievementDataWithCollectedAchievement | ObtainAchievementDataWithProgressOnly
> {
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
      if (isObtainedAchievement(item)) this.handleDiscordAnnoucment(item);
      // pretty sure it will be defined but still hard code 2500 as default
      const timeoutDelay = isObtainedAchievement(item)
        ? item.stage.data.showTimeMs
        : item.progressData.currentStage?.showTimeMs || 2500;
      this.startTimeout(timeoutDelay + 1000);
    });
  }

  private async handleDiscordAnnoucment(item: ObtainAchievementDataWithCollectedAchievement) {
    if (this.configs.obtainedAchievementsChannelId) {
      const messageToSend = this.getDiscordAchievementMessage(item);
      sendMessageInChannelByChannelId(discordClient, this.configs.obtainedAchievementsChannelId, messageToSend);
    }
  }

  private getDiscordAchievementMessage({
    username,
    stage: { data, timestamp },
    achievement
  }: ObtainAchievementDataWithCollectedAchievement) {
    return codeBlock(
      "js",
      `${moment(timestamp).format("DD-MM-YYYY HH:MM:ss")}\nUser: "${username}" - obtained achievement ${
        achievement.name
      }\nName: '${data.name}'\nGoal: ${
        achievement.isTime ? `'${getDateFromSecondsToYMDHMS(data.goal).trim()}'` : data.goal
      }\nBadge: '${data.badge.name}'`
    );
  }

  public override enqueue(item: ObtainAchievementDataWithCollectedAchievement | ObtainAchievementDataWithProgressOnly) {
    super.enqueue(item, `${item.username} - ${item.achievement.name}`);

    this.startTimeout(500);
  }

  private convertUpdateDataToObtainAchievementData(data: UpdateAchievementUserProgressProgressesReturnData) {
    const nowFinishedStagesInfo = getDataForObtainAchievementEmit({
      foundAchievement: data.foundAchievement,
      nowFinishedStages: data.nowFinishedStages,
      gainedProgress: data.gainedProgress
    });
    return nowFinishedStagesInfo;
  }

  private async updateAchievementUserProgressAndAddToQueue({
    username,
    ...rest
  }: UpdateAchievementUserProgressOpts): Promise<UpdateAchievementUserProgressReturn> {
    if (!(await getCurrentStreamSession({})))
      return { error: true, message: "Achievements can be added only when stream session is active" };

    const updateData = await updateAchievementUserProgressProgresses(rest);

    if (!updateData) {
      achievementsLogger.error("Not found update data in updateAchievementUserProgressAndAddToQueue");
      return { error: true, message: "Probably achievement is turned off" };
    }

    const modifiedUpdateData = this.convertUpdateDataToObtainAchievementData(updateData);

    if (modifiedUpdateData.stages.length > 0) this.addObtainedAchievementDataToQueue(modifiedUpdateData, username);
    else if (modifiedUpdateData.gainedProgress !== null) {
      const gainedProgress = modifiedUpdateData.gainedProgress;
      this.addAchievementProgressDataToQueue({ ...modifiedUpdateData, gainedProgress }, username);
    }

    return { error: false };
  }

  private async addAnonymousAchievementProgress({
    achievementName,
    username,
    gainedProgress
  }: AddAnonymousAchievementProgressData) {
    const foundAchievement = await getOneAchievement({ name: achievementName }, {});
    if (!foundAchievement)
      return achievementsLogger.error(`Not found achievement in addAnonymousAchievementProgress , ${foundAchievement}`);

    const {
      stages: { stageData }
    } = foundAchievement;

    const nextStageIndex = stageData.findIndex(({ goal }) => goal > gainedProgress.progress);
    const currentStageIndex = nextStageIndex === -1 ? -1 : nextStageIndex - 1;
    this.addAchievementProgressDataToQueue(
      {
        achievement: foundAchievement,
        gainedProgress: {
          ...gainedProgress,
          ...(nextStageIndex !== -1 ? { nextStage: stageData.at(nextStageIndex) } : undefined),
          currentStage: stageData.at(currentStageIndex)
        }
      },
      username
    );
  }

  private addAchievementProgressDataToQueue(data: AddAchievementProgressDataToQueueData, username: string) {
    this.enqueue({
      achievement: data.achievement,
      progressData: data.gainedProgress,
      username,
      id: randomUUID()
    } as ObtainAchievementDataWithProgressOnly);
  }

  private addObtainedAchievementDataToQueue(data: GetDataForObtainAchievementEmitReturnData, username: string) {
    data.stages.forEach((stage) =>
      this.enqueue({
        achievement: data.achievement,
        stage,
        username,
        id: randomUUID()
      } as ObtainAchievementDataWithCollectedAchievement)
    );
  }

  private onEmulateAchievementSocket() {
    this.socketIO.on("connect", (socket) => {
      socket.on("emulateAchievement", (data) => {
        this.enqueue(data);
      });

      socket.on("addAchievementProgressToUser", async (data, cb) => {
        try {
          const update = await this.updateAchievementUserProgressAndAddToQueue(data);
          if (update.error) throw Error(update.message);

          cb(null);
        } catch (error) {
          if (error instanceof Error) {
            cb(error.message);
          } else {
            cb("An unknown error occured");
          }
        }
      });
    });
  }

  private emitObtainAchievement(
    emitData: ObtainAchievementDataWithCollectedAchievement | ObtainAchievementDataWithProgressOnly
  ) {
    this.socketIO.emit("obtainAchievement", emitData);
  }

  public async checkMessageForAchievements({ messageData, ...data }: CheckMessageForAchievement) {
    await this.checkCustomMessageAchievements({ messageData, ...data });

    await this.checkMessageForAchievementWithCondition({
      ...data,
      condition: !!messageData.emotes,
      achievementName: ACHIEVEMENTS.EMOTES_COUNT
    });

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
      progress: { value: messageCount }
    });
    await this.updateAchievementUserProgressAndAddToQueue({
      ...commonData,
      achievementName: ACHIEVEMENTS.WATCH_TIME,
      progress: { value: watchTime }
    });
    await this.updateAchievementUserProgressAndAddToQueue({
      ...commonData,
      achievementName: ACHIEVEMENTS.POINTS,
      progress: { value: points }
    });
    if (follower) {
      await this.checkUserFollowageForAchievement({ ...commonData, dateProgress: follower });
    }

    await this.handleRandomAchievementLogic({ ...commonData });

    await this.handleBadgesLogic(commonData);

    await this.checkCustomWatchTimeAchievements({ ...commonData, progress: watchTime });
  }

  private async handleRandomAchievementLogic(data: CommonAchievementCheckType) {
    // I guess it should be 1% hard codded
    if (!percentChance(1)) return;
    achievementsLogger.info(`User ${data.username} - got lucky and received: ${ACHIEVEMENTS.RANDOMLY_CHOOSEN}`);
    await this.updateAchievementUserProgressAndAddToQueue({
      achievementName: ACHIEVEMENTS.RANDOMLY_CHOOSEN,
      ...data,
      progress: { value: 1, increment: true }
    });
  }

  public async checkUserFollowageForAchievement({ dateProgress, ...rest }: CheckGlobalUserDetailsDateArgs) {
    // add 1 minute bonus there to prevent situations where followDate===current date
    const secondsFollow = moment().add(1, "minute").diff(moment(dateProgress), "seconds");

    await this.updateAchievementUserProgressAndAddToQueue({
      achievementName: ACHIEVEMENTS.FOLLOWAGE,
      progress: { value: secondsFollow },
      ...rest
    });
  }

  public async checkRaidFromForAchievements({ viewersAmount, ...rest }: CheckRaidFromForAchievementsParams) {
    await this.updateAchievementUserProgressAndAddToQueue({
      achievementName: ACHIEVEMENTS.RAID_FROM,
      progress: { value: viewersAmount },
      ...rest
    });
  }

  public async checkUserCheersForAchievements({
    bits,
    isAnonymous,
    message,
    username,
    userId
  }: CheckUserCheersForAchievementsParams) {
    //TODO: add usage of message
    const cheerAchievements = [
      { achievement: ACHIEVEMENTS.SENT_CHEERS, pack: false },
      { achievement: ACHIEVEMENTS.SENT_CHEERS_AS_PACK, pack: true }
    ];
    for (const achievementData of cheerAchievements) {
      if (!isAnonymous && username && userId) {
        await this.updateAchievementUserProgressAndAddToQueue({
          achievementName: achievementData.achievement,
          progress: { value: bits },
          userId,
          username
        });
      } else {
        await this.addAnonymousAchievementProgress({
          achievementName: achievementData.achievement,
          username: "Anonymous user",
          gainedProgress: { progress: bits, timestamp: Date.now() }
        });
      }
    }
  }

  public async checkUserSubscribeForAchievements({ tier, isGift, ...rest }: CheckUserSubscribeForAchievementsParams) {
    const tierAchievements = new Map<SubscriptionTiers, ACHIEVEMENTS[]>([
      [
        "3000",
        [ACHIEVEMENTS.SUBSCRIBTIONS_TIER_3, ACHIEVEMENTS.SUBSCRIBTIONS_TIER_2, ACHIEVEMENTS.SUBSCRIBTIONS_TIER_1]
      ],
      ["2000", [ACHIEVEMENTS.SUBSCRIBTIONS_TIER_2, ACHIEVEMENTS.SUBSCRIBTIONS_TIER_1]],
      ["1000", [ACHIEVEMENTS.SUBSCRIBTIONS_TIER_1]]
    ]);
    const tierAchievementsToUpdate: ACHIEVEMENTS[] = [
      ...(tierAchievements.get(tier) ?? []),
      ...(isGift ? [ACHIEVEMENTS.RECEIVED_SUBSCRIBTIONS_GIFTS] : [ACHIEVEMENTS.BOUGHT_SUBSCRIBTIONS])
    ];

    for await (const achievementName of tierAchievementsToUpdate) {
      await this.updateAchievementUserProgressAndAddToQueue({
        achievementName,
        progress: { value: 1, increment: true },
        ...rest
      });
    }
  }

  public async checkUserSubscribeGiftsForAchievements({
    tier,
    amount,
    isAnonymous,
    ...rest
  }: CheckUserSubscribeGiftsForAchievementsParams) {
    const tierAchievements = new Map<
      SubscriptionTiers,
      { achievements: ACHIEVEMENTS[]; packAchievements: ACHIEVEMENTS[] }
    >([
      [
        "3000",
        {
          achievements: [ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_TIER_3],
          packAchievements: [ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_AS_PACK_TIER_3]
        }
      ],
      [
        "2000",
        {
          achievements: [ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_TIER_2],
          packAchievements: [ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_AS_PACK_TIER_2]
        }
      ],
      [
        "1000",
        {
          achievements: [ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_TIER_1],
          packAchievements: [ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_AS_PACK_TIER_1]
        }
      ]
    ]);

    const tierAchievementsToUpdate = tierAchievements.get(tier) || { achievements: [], packAchievements: [] };

    for await (const achievementName of [
      ...tierAchievementsToUpdate.achievements,
      ...tierAchievementsToUpdate.packAchievements
    ]) {
      const progressValue = tierAchievementsToUpdate.achievements.includes(achievementName)
        ? { value: amount, increment: true }
        : { value: amount };

      if (isAnonymous)
        await this.addAnonymousAchievementProgress({
          achievementName,
          gainedProgress: {
            progress: amount,
            timestamp: Date.now()
          },
          username: "Anonymous user"
        });
      else {
        await this.updateAchievementUserProgressAndAddToQueue({
          achievementName,
          progress: progressValue,
          ...rest
        });
      }
    }
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

  public async incrementAddNewSongToDatabaseAchievements(args: CommonAchievementCheckType) {
    await this.updateAchievementUserProgressAndAddToQueue({
      achievementName: ACHIEVEMENTS.ADDED_NEW_SONG_TO_DB,
      ...args,
      progress: { value: 1, increment: true }
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

      const condition = this.checkAchievementDependsOnMessageAction(custom, data.messageData.message);
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

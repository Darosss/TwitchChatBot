import HeadHandler from "./HeadHandler";
import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { eventsubLogger, retryWithCatch, getMp3AudioDuration } from "@utils";
import { createStreamSession, updateCurrentStreamSession, createRedemption, createUserIfNotExist } from "@services";
import fs from "fs";
import { alertSoundsPath, alertSoundPrefix } from "@configs";
import path from "path";
import { AuthorizedUserData } from "./types";
import AchievementsHandler from "./AchievementsHandler";
import { RewardData, SocketHandler } from "@socket";
import MusicHeadHandler from "./music/MusicHeadHandler";

interface EventSubHandlerOptions {
  apiClient: ApiClient;
  authorizedUser: AuthorizedUserData;
}

export type SubscriptionTiers = "1000" | "2000" | "3000";

class EventSubHandler extends HeadHandler {
  private listener: EventSubWsListener;
  private redemptionQue: [RewardData, { audioBuffer: Buffer; duration: number }][] = [];
  private isAlertPlaying = false;

  constructor(options: EventSubHandlerOptions) {
    super(options.apiClient, options.authorizedUser);
    this.listener = new EventSubWsListener({
      apiClient: options.apiClient
    });
  }

  public async updateOptions(options: EventSubHandlerOptions): Promise<void> {
    this.stop();
    const { apiClient, authorizedUser } = options;
    this.updateProperties(apiClient, authorizedUser);
    this.listener = new EventSubWsListener({ apiClient: options.apiClient });
    this.init();
  }

  private async subscribeToStreamOfflineEvents() {
    this.listener.onStreamOffline(this.authorizedUser.id, async (e) => {
      eventsubLogger.info(`${e.broadcasterDisplayName} just went offline`);
      await updateCurrentStreamSession({ sessionEnd: new Date() });
    });
  }

  private async subscribeToChannelUpdateEvents() {
    this.listener.onChannelUpdate(this.authorizedUser.id, async (e) => {
      eventsubLogger.info(`Stream details has been updated`);
      const timestamp = Date.now();
      try {
        await updateCurrentStreamSession({
          $set: {
            [`categories.${timestamp}`]: e.categoryName,
            [`sessionTitles.${timestamp}`]: e.streamTitle
          }
        });
      } catch (err) {
        eventsubLogger.info(err); //todo add error
      }
    });
  }

  private async subscribeToChannelSubscription() {
    this.listener.onChannelSubscription(this.authorizedUser.id, async (e) => {
      const { userDisplayName, userId, userName, tier, isGift } = e;
      eventsubLogger.info(
        `Someone subbed to channel: ${JSON.stringify({
          userDisplayName,
          userId,
          userName,
          tier,
          isGift
        })}`
      );

      const userData = { username: userDisplayName, twitchId: userId, twitchName: userName };
      try {
        const userDB = await createUserIfNotExist({ twitchId: userId }, userData);
        if (!userDB) {
          return eventsubLogger.error(`subscribeToChannelSubscription - error when trying to manipulate user data`);
        }
        await AchievementsHandler.getInstance().checkUserSubscribeForAchievements({
          userId: userDB._id,
          username: userDB.username,
          tier,
          isGift
        });
      } catch (err) {
        eventsubLogger.error(`Error occured in subscribeToChannelSubscription: ${err}`);
      }
    });
  }

  private async subscribeToChannelSubscriptionGift() {
    this.listener.onChannelSubscriptionGift(this.authorizedUser.id, async (e) => {
      const { tier, gifterName, cumulativeAmount, amount, isAnonymous, gifterId, gifterDisplayName } = e;
      eventsubLogger.info(
        `Someone gave a gift to channel: ${JSON.stringify({
          tier,
          cumulativeAmount,
          amount,
          isAnonymous,
          gifterId,
          gifterDisplayName
        })}`
      );

      const userData = {
        username: gifterDisplayName,
        twitchId: gifterId,
        twitchName: gifterName
      };

      try {
        const userDB = await createUserIfNotExist({ twitchId: gifterId }, userData);
        if (!userDB)
          return eventsubLogger.error(`subscribeToChannelFollow - error when trying to manipulate user data`);

        await AchievementsHandler.getInstance().checkUserSubscribeGiftsForAchievements({
          userId: userDB._id,
          username: userDB.username,
          tier,
          amount: amount || 1,
          isAnonymous
        });
      } catch (err) {
        eventsubLogger.error(`Error occured in subscribeToChannelFollow: ${err}`);
      }
    });
  }

  private async subscribeToChannelFollow() {
    this.listener.onChannelFollow(this.authorizedUser.id, this.authorizedUser.id, async (e) => {
      const { followDate, userDisplayName, userId, userName } = e;
      eventsubLogger.info(
        `Someone gave a follow to channel: ${JSON.stringify({ followDate, userDisplayName, userId, userName })}`
      );

      const userData = {
        username: userDisplayName,
        twitchId: userId,
        twitchName: userName,
        follower: followDate
      };

      try {
        const userDB = await createUserIfNotExist({ twitchId: userId }, userData);
        if (!userDB) {
          return eventsubLogger.error(`subscribeToChannelFollow - error when trying to manipulate user data`);
        }
        await AchievementsHandler.getInstance().checkUserFollowageForAchievement({
          userId: userDB._id,
          username: userDB.username,
          dateProgress: followDate
        });
      } catch (err) {
        eventsubLogger.error(`Error occured in subscribeToChannelFollow: ${err}`);
      }
    });
  }
  private async subscribeToChannelRaidFrom() {
    this.listener.onChannelRaidFrom(this.authorizedUser.id, async (e) => {
      const { viewers, raidingBroadcasterDisplayName, raidingBroadcasterId, raidingBroadcasterName } = e;

      eventsubLogger.info(
        `Someone raided a channel: ${JSON.stringify({
          viewers,
          raidingBroadcasterDisplayName,
          raidingBroadcasterId,
          raidingBroadcasterName
        })}`
      );

      const userData = {
        username: raidingBroadcasterDisplayName,
        twitchId: raidingBroadcasterId,
        twitchName: raidingBroadcasterName
      };

      try {
        const userDB = await createUserIfNotExist({ twitchId: raidingBroadcasterId }, userData);
        if (!userDB) {
          return eventsubLogger.error(`subscribeToChannelRaidFrom - error when trying to manipulate user data`);
        }
        await AchievementsHandler.getInstance().checkRaidFromForAchievements({
          viewersAmount: viewers,
          userId: userDB._id,
          username: userDB.username
        });
      } catch (err) {
        eventsubLogger.error(`Error occured in subscribeToChannelRaidFrom: ${err}`);
      }
    });
  }

  private async subscribeToChannelCheer() {
    this.listener.onChannelCheer(this.authorizedUser.id, async (e) => {
      const { bits, userDisplayName, userId, userName, message, isAnonymous } = e;
      eventsubLogger.info(
        `Someone cheered to channel: ${JSON.stringify({
          bits,
          userDisplayName,
          userId,
          userName,
          message,
          isAnonymous
        })}`
      );

      try {
        const userDB = isAnonymous
          ? null
          : await createUserIfNotExist(
              { twitchId: userId },
              {
                //NOTE:below 3: null assertion - because I know if !isAnonymous its not null
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                username: userDisplayName!,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                twitchId: userId!,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                twitchName: userName!
              }
            );

        await AchievementsHandler.getInstance().checkUserCheersForAchievements({
          isAnonymous,
          bits,
          message,
          userId: userDB?._id,
          username: userDB?.username
        });
      } catch (err) {
        eventsubLogger.error(`Error occured in subscribeToChannelCheer: ${err}`);
      }
    });
  }

  private async createStreamSessionHelper(startDate: Date, title: string, category: string) {
    const timestampUpdateStream = startDate.getTime().toString();

    const newSession = await createStreamSession({
      sessionStart: startDate,
      sessionTitles: new Map([[timestampUpdateStream, title]]),
      categories: new Map([[timestampUpdateStream, category]])
    });

    return newSession;
  }

  private async subscribeToStreamOnlineEvents() {
    this.listener.onStreamOnline(this.authorizedUser.id, async (e) => {
      eventsubLogger.info(`${e.broadcasterDisplayName} just went live!`);
      const stream = await retryWithCatch(() => e.getStream());

      await this.createStreamSessionHelper(
        e.startDate || new Date(), // Because twitch goes wild...sometimes
        stream?.title || "", // Because twitch goes wild...sometimes
        stream?.gameName || "" // Because twitch goes wild...sometimes
      );
    });
  }

  private async subscribeToChannelRedemptionAddEvents() {
    this.listener.onChannelRedemptionAdd(this.authorizedUser.id, async (e) => {
      const {
        rewardId,
        userId,
        userName,
        userDisplayName,
        redemptionDate,
        rewardTitle,
        rewardCost,
        input,
        updateStatus
      } = e;
      const user = await createUserIfNotExist(
        { twitchId: userId },
        { twitchId: userId, username: userDisplayName, twitchName: userName }
      );

      const reward = await e.getReward();

      const rewardData = {
        userId: user?._id,
        rewardId: rewardId,
        twitchId: userId,
        userName: userName,
        userDisplayName: userDisplayName,
        redemptionDate: redemptionDate,
        rewardTitle: rewardTitle,
        rewardCost: rewardCost,
        rewardImage: reward.getImageUrl(4)
      };

      try {
        await createRedemption(rewardData);
      } catch (err) {
        eventsubLogger.info(`Couldn't save redemption ${rewardTitle} from ${userName}`);
      }

      eventsubLogger.info(`${e.userDisplayName} just took redemption! ${rewardTitle}`);

      const alertSoundPath = path.join(alertSoundsPath, rewardTitle) + ".mp3";
      let alertSoundFileBuffer: Buffer;

      await MusicHeadHandler.getInstance().handleIfSongRequestRewardIsRedeemed({
        title: rewardTitle,
        input,
        username: userDisplayName,
        updateStatus: updateStatus.bind(e)
      });

      // manage alert sounds
      if (!rewardTitle.startsWith(alertSoundPrefix)) return;

      try {
        alertSoundFileBuffer = fs.readFileSync(path.join(alertSoundsPath, rewardTitle) + ".mp3");
      } catch (err) {
        if (err instanceof Error) {
          eventsubLogger.info(`Error occured while trying to get mp3 file for redemptions. ${err.message}`);
        }
        return;
      }

      const alertSoundDurationSec = await getMp3AudioDuration(alertSoundPath);

      this.addSoundToAlertQue(rewardData, alertSoundFileBuffer, alertSoundDurationSec);
      this.startAlertSounds();
    });
  }

  private addSoundToAlertQue(rewardData: RewardData, soundBuffer: Buffer, soundDuration: number) {
    this.redemptionQue.push([rewardData, { audioBuffer: soundBuffer, duration: soundDuration }]);
  }

  private startAlertSounds(delay = 0) {
    if (this.isAlertPlaying) return;

    setTimeout(() => {
      const firstAlert = this.getFirstFromAlertQue();
      if (!firstAlert) {
        return;
      }
      this.isAlertPlaying = true;

      SocketHandler.getInstance().getIO().emit("onRedemption", firstAlert[0], firstAlert[1].audioBuffer);

      setTimeout(() => {
        this.isAlertPlaying = false;
        this.startAlertSounds();
      }, firstAlert[1].duration * 1000 + 1000);
    }, delay);
  }

  private getFirstFromAlertQue() {
    const firstQueItem = this.redemptionQue.shift();

    return firstQueItem;
  }

  public async start() {
    this.listener.start();
  }

  public async stop() {
    this.listener.stop();
  }

  public async init() {
    await this.start();
    await this.initEvents();
  }

  private async initEvents() {
    await this.twitchApi.eventSub.deleteAllSubscriptions();
    await this.subscribeToChannelUpdateEvents();
    await this.subscribeToStreamOfflineEvents();
    await this.subscribeToChannelRedemptionAddEvents();
    await this.subscribeToStreamOnlineEvents();
    await this.subscribeToChannelFollow();
    await this.subscribeToChannelSubscription();
    await this.subscribeToChannelSubscriptionGift();
    await this.subscribeToChannelCheer();
    await this.subscribeToChannelRaidFrom();
  }
}

export default EventSubHandler;

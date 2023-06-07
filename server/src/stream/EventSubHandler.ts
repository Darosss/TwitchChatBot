import HeadHandler from "./HeadHandler";
import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, RewardData } from "@socket";
import { eventsubLogger } from "@utils/loggerUtil";
import { createStreamSession, updateCurrentStreamSession } from "@services/streamSessions";
import { createRedemption } from "@services/redemptions";
import { createUserIfNotExist } from "@services/users";
import retryWithCatch from "@utils/retryWithCatchUtil";
import fs from "fs";
import { alertSoundsPath } from "@configs/globalPaths";
import path from "path";
import { getMp3AudioDuration } from "@utils/filesManipulateUtil";
import { alertSoundPrefix } from "@configs/globalVariables";
import { AuthorizedUserData } from "./types";

interface EventSubHandlerOptions {
  apiClient: ApiClient;
  socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  authorizedUser: AuthorizedUserData;
}

class EventSubHandler extends HeadHandler {
  private static instance: EventSubHandler;
  private listener: EventSubWsListener;
  private redemptionQue: [RewardData, { audioBuffer: Buffer; duration: number }][] = [];
  private isAlertPlaying = false;
  private constructor(options: EventSubHandlerOptions) {
    super(options.socketIO, options.apiClient, options.authorizedUser);
    this.listener = new EventSubWsListener({ apiClient: options.apiClient });
  }

  public static getInstance(options: EventSubHandlerOptions): EventSubHandler {
    if (!EventSubHandler.instance) {
      EventSubHandler.instance = new EventSubHandler(options);
    } else {
      EventSubHandler.instance.updateOptions(options);
    }
    return EventSubHandler.instance;
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
      const { rewardId, userId, userName, userDisplayName, redemptionDate, rewardTitle, rewardCost } = e;

      const user = await createUserIfNotExist(
        { twitchId: userId },
        {
          twitchId: userId,
          username: userDisplayName,
          twitchName: userName,
          privileges: 0
        }
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

      this.socketIO.emit("onRedemption", firstAlert[0], firstAlert[1].audioBuffer);

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
    await this.subscribeToChannelUpdateEvents();
    await this.subscribeToStreamOfflineEvents();
    await this.subscribeToChannelRedemptionAddEvents();
    await this.subscribeToStreamOnlineEvents();
  }
}

export default EventSubHandler;

import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  RewardData,
} from "@libs/types";
import { eventsubLogger } from "@utils/loggerUtil";
import {
  createStreamSession,
  updateCurrentStreamSession,
} from "@services/streamSessions";
import { createRedemption } from "@services/redemptions";
import { createUserIfNotExist } from "@services/users";
import retryWithCatch from "@utils/retryWithCatchUtil";
import fs from "fs";
import { alertSoundsPath } from "@configs/globalPaths";
import path from "path";
import { getMp3AudioDuration } from "@utils/filesManipulateUtil";
class EventSubHandler {
  private readonly listener: EventSubWsListener;
  private userId: string;
  private readonly socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  private redemptionQue: [
    RewardData,
    { audioBuffer: Buffer; duration: number }
  ][] = [];
  private isAlertPlaying = false;
  constructor(
    apiClient: ApiClient,
    userId: string,
    socketIO: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >
  ) {
    this.listener = new EventSubWsListener({ apiClient });
    this.userId = userId;
    this.socketIO = socketIO;
  }

  async subscribeToStreamOfflineEvents() {
    await this.listener.subscribeToStreamOfflineEvents(
      this.userId,
      async (e) => {
        eventsubLogger.info(`${e.broadcasterDisplayName} just went offline`);
        await updateCurrentStreamSession({ sessionEnd: new Date() });
      }
    );
  }

  async subscribeToChannelUpdateEvents() {
    await this.listener.subscribeToChannelUpdateEvents(
      this.userId,
      async (e) => {
        eventsubLogger.info(`Stream details has been updated`);
        const timestamp = Date.now();
        try {
          await updateCurrentStreamSession({
            $set: {
              [`categories.${timestamp}`]: e.categoryName,
              [`sessionTitles.${timestamp}`]: e.streamTitle,
            },
          });
        } catch (err) {
          eventsubLogger.info(err); //todo add error
        }
      }
    );
  }

  async createStreamSessionHelper(
    startDate: Date,
    title: string,
    category: string
  ) {
    const timestampUpdateStream = startDate.getTime().toString();

    const newSession = await createStreamSession({
      sessionStart: startDate,
      sessionTitles: new Map([[timestampUpdateStream, title]]),
      categories: new Map([[timestampUpdateStream, category]]),
    });

    return newSession;
  }

  async subscribeToStreamOnlineEvents() {
    await this.listener.subscribeToStreamOnlineEvents(
      this.userId,
      async (e) => {
        eventsubLogger.info(`${e.broadcasterDisplayName} just went live!`);
        const stream = await retryWithCatch(() => e.getStream());

        const newStreamSession = await this.createStreamSessionHelper(
          e.startDate || new Date(), // Because twitch goes wild
          stream?.title || "", // Because twitch goes wild
          stream?.gameName || "" // Because twitch goes wild
        );
      }
    );
  }

  async subscribeToChannelRedemptionAddEvents() {
    await this.listener.subscribeToChannelRedemptionAddEvents(
      this.userId,
      async (e) => {
        const {
          rewardId,
          userId,
          userName,
          userDisplayName,
          redeemedAt,
          rewardTitle,
          rewardCost,
        } = e;

        const user = await createUserIfNotExist(
          { twitchId: userId },
          {
            twitchId: userId,
            username: userDisplayName,
            twitchName: userName,
            privileges: 0,
          }
        );

        const reward = await e.getReward();

        const rewardData = {
          userId: user?._id,
          rewardId: rewardId,
          twitchId: userId,
          userName: userName,
          userDisplayName: userDisplayName,
          redemptionDate: redeemedAt,
          rewardTitle: rewardTitle,
          rewardCost: rewardCost,
          rewardImage: reward.getImageUrl(4),
        };

        try {
          await createRedemption(rewardData);
        } catch (err) {
          eventsubLogger.info(
            `Couldn't save redemption ${rewardTitle} from ${userName}`
          );
        }

        eventsubLogger.info(
          `${e.userDisplayName} just took redemption! ${rewardTitle}`
        );

        const alertSoundPath = path.join(alertSoundsPath, rewardTitle) + ".mp3";
        const alertSoundFileBuffer = fs.readFileSync(
          path.join(alertSoundsPath, rewardTitle) + ".mp3"
        );
        if (!alertSoundFileBuffer) return;

        const alertSoundDurationSec = await getMp3AudioDuration(alertSoundPath);

        this.addSoundToAlertQue(
          rewardData,
          alertSoundFileBuffer,
          alertSoundDurationSec
        );
        this.startAlertSounds();
      }
    );
  }

  addSoundToAlertQue(
    rewardData: RewardData,
    soundBuffer: Buffer,
    soundDuration: number
  ) {
    this.redemptionQue.push([
      rewardData,
      { audioBuffer: soundBuffer, duration: soundDuration },
    ]);
  }

  startAlertSounds(delay = 0) {
    if (this.isAlertPlaying) return;

    setTimeout(() => {
      const firstAlert = this.getFirstFromAlertQue();
      if (!firstAlert) {
        return;
      }
      this.isAlertPlaying = true;

      this.socketIO.emit(
        "onRedemption",
        firstAlert[0],
        firstAlert[1].audioBuffer
      );

      setTimeout(() => {
        this.isAlertPlaying = false;
        this.startAlertSounds();
      }, firstAlert[1].duration * 1000 + 1000);
    }, delay);
  }

  getFirstFromAlertQue() {
    const firstQueItem = this.redemptionQue.shift();

    return firstQueItem;
  }

  async start() {
    await this.listener.start();
  }

  async stop() {
    await this.listener.stop();
  }

  async init() {
    await this.start();
    await this.initEvents();
  }

  async initEvents() {
    await this.subscribeToChannelUpdateEvents();
    await this.subscribeToStreamOfflineEvents();
    await this.subscribeToChannelRedemptionAddEvents();
    await this.subscribeToStreamOnlineEvents();
  }
}

export default EventSubHandler;
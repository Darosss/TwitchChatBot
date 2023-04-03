import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";

import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";
import { createUserIfNotExist } from "@services/users";
import { createRedemption } from "@services/redemptions";
import {
  createStreamSession,
  getCurrentStreamSession,
  updateCurrentStreamSession,
} from "@services/streamSessions";
import { eventsubLogger } from "@utils/loggerUtil";
import retryWithCatch from "@utils/retryWithCatchUtil";

const eventSub = async (
  apiClient: ApiClient,
  userId: string,
  socket: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  const listener = new EventSubWsListener({ apiClient });
  await listener.start();
  const apiStream = await apiClient.streams.getStreamByUserId(userId);

  const offlineSubscription = await listener.subscribeToStreamOfflineEvents(
    userId,
    async (e) => {
      eventsubLogger.info(`${e.broadcasterDisplayName} just went offline`);
      await updateCurrentStreamSession({ sessionEnd: new Date() });
    }
  );

  const onUpdateStreamDetails = await listener.subscribeToChannelUpdateEvents(
    userId,
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

  const redemptionSubscription =
    await listener.subscribeToChannelRedemptionAddEvents(userId, async (e) => {
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

      socket.emit("onRedemption", rewardData);
      eventsubLogger.info(
        `${e.userDisplayName} just took redemption! ${rewardTitle}`
      );
    });

  const onlineSubscription = await listener.subscribeToStreamOnlineEvents(
    userId,
    async (e) => {
      eventsubLogger.info(`${e.broadcasterDisplayName} just went live!`);
      const stream = await retryWithCatch(() => e.getStream());

      const newStreamSession = await createStreamSessionHelper(
        e.startDate || new Date(), // Because twitch goes wild
        stream?.title || "", // Because twitch goes wild
        stream?.gameName || "" // Because twitch goes wild
      );
    }
  );

  if (apiStream) {
    eventsubLogger.info("Stream found - checking for session");
    let currentSession = await getCurrentStreamSession({});
    if (!currentSession) return;

    const { startDate, title = "", gameName = "" } = apiStream;

    if (currentSession.sessionStart.getTime() !== startDate.getTime()) {
      eventsubLogger.info(`Session not found - create new one - ${startDate}`);
      await createStreamSessionHelper(startDate, title, gameName);
    }
  }
};

async function createStreamSessionHelper(
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

export default eventSub;

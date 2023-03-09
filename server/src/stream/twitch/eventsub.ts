import { ApiClient, HelixStream } from "@twurple/api";
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
  updateStreamSessionById,
} from "@services/streamSessions";

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

  const offlineSubscription = async (sessionId: string) => {
    return await listener.subscribeToStreamOfflineEvents(userId, async (e) => {
      console.log(`${e.broadcasterDisplayName} just went offline`);
      await updateStreamSessionById(sessionId, { sessionEnd: new Date() });
    });
  };

  const onUpdateStreamDetails = async (sessionId: string) => {
    return await listener.subscribeToChannelUpdateEvents(userId, async (e) => {
      console.log("Stream details has been updated");
      const timestamp = Date.now();

      await updateStreamSessionById(sessionId, {
        $set: {
          [`categories.${timestamp}`]: e.categoryName,
          [`sessionTitles.${timestamp}`]: e.streamTitle,
        },
      });
    });
  };

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
        console.log(err, "Couldn't save redemption");
      }

      socket.emit("onRedemption", rewardData);
      console.log(`${e.userDisplayName} just took redemption!`);
    });

  if (!apiStream) {
    const onlineSubscription = await listener.subscribeToStreamOnlineEvents(
      userId,
      (e) => {
        console.log(`${e.broadcasterDisplayName} just went live!`);
        e.getStream()
          .then(async (stream) => {
            const newStreamSession = await createStreamSessionHelper(
              e.startDate,
              stream.title,
              stream.gameName
            );

            onUpdateStreamDetails(newStreamSession.id);
            offlineSubscription(newStreamSession.id);
          })
          .catch((err) => console.log("Online subs err", err));
      }
    );
  } else {
    let currentSession = await getCurrentStreamSession({});
    if (!currentSession) return;

    const { startDate, title, gameName } = apiStream;

    if (currentSession.sessionStart.getTime() !== startDate.getTime()) {
      currentSession = await createStreamSessionHelper(
        startDate,
        title,
        gameName
      );
    }

    await onUpdateStreamDetails(currentSession.id);
    await offlineSubscription(currentSession.id);
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

import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";

import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";
import { createUserIfNotExist } from "@services/User";
import { createRedemption } from "@services/Redemption";
import {
  createStreamSession,
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

  const onlineSubscription = await listener.subscribeToStreamOnlineEvents(
    userId,
    (e) => {
      console.log(`${e.broadcasterDisplayName} just went live!`);
      e.getStream()
        .then(async (stream) => {
          const timestampUpdateStream = e.startDate.getTime().toString();

          const newStreamSession = await createStreamSession({
            sessionStart: e.startDate,
            sessionTitles: new Map([[timestampUpdateStream, stream.title]]),
            categories: new Map([[timestampUpdateStream, stream.gameName]]),
          });

          onUpdateStreamDetails(newStreamSession.id);
          offlineSubscription(newStreamSession.id);
        })
        .catch((err) => console.log("Online subs err", err));
    }
  );

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
};

export default eventSub;

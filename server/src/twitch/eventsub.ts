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
  createTwitchSession,
  updateTwitchSessionById,
} from "@services/TwitchSession";

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
          const newTwitchSession = await createTwitchSession({
            sessionStart: e.startDate,
            sessionTitles: [stream.title],
            categories: [stream.gameName],
          });

          onUpdateStreamDetails(newTwitchSession.id);
          offlineSubscription(newTwitchSession.id);
        })
        .catch((err) => console.log("Online subs err", err));
    }
  );

  const offlineSubscription = async (sessionId: string) => {
    return await listener.subscribeToStreamOfflineEvents(userId, async (e) => {
      console.log(`${e.broadcasterDisplayName} just went offline`);
      await updateTwitchSessionById(sessionId, { sessionEnd: new Date() });
    });
  };

  const onUpdateStreamDetails = async (sessionId: string) => {
    return await listener.subscribeToChannelUpdateEvents(userId, async (e) => {
      console.log("Stream details has been updated");
      await updateTwitchSessionById(sessionId, {
        $push: { categories: e.categoryName, sessionTitles: e.streamTitle },
      });
    });
  };
};

export default eventSub;

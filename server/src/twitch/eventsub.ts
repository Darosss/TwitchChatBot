import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";

import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../../../libs/types";
import { Redemption } from "../models/redemption.model";
import { TwitchSession } from "../models/twitch-session.model";

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

      const reward = await e.getReward();
      const rewardData = {
        rewardId: rewardId,
        userId: userId,
        userName: userName,
        userDisplayName: userDisplayName,
        redemptionDate: redeemedAt,
        rewardTitle: rewardTitle,
        rewardCost: rewardCost,
        rewardImage: reward.getImageUrl(4),
      };

      try {
        await new Redemption(rewardData).save();
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
        .then((stream) => {
          console.log("swtream tag", stream.tags);
          new TwitchSession({
            sessionStart: e.startDate,
            sessionTitles: stream.title,
            categories: stream.gameName,
            tags: stream.tags || "",
          }).save((err, doc) => {
            if (err) console.log("err save", err);
            onUpdateStreamDetails(doc.id);
            offlineSubscription(doc.id);
          });
        })
        .catch((err) => console.log("Online subs err", err));
    }
  );

  const offlineSubscription = async (sessionId: string) => {
    return await listener.subscribeToStreamOfflineEvents(userId, async (e) => {
      console.log(`${e.broadcasterDisplayName} just went offline`);
      await TwitchSession.findByIdAndUpdate(sessionId, {
        sessionEnd: new Date(),
      });
    });
  };

  const onUpdateStreamDetails = async (sessionId: string) => {
    return await listener.subscribeToChannelUpdateEvents(userId, async (e) => {
      console.log("Stream details has been updated");
      await TwitchSession.findByIdAndUpdate(sessionId, {
        $push: { categories: e.categoryName, sessionTitles: e.streamTitle },
      });
    });
  };
};

export default eventSub;

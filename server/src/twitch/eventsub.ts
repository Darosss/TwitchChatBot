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
};

export default eventSub;

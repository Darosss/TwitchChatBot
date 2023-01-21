import { PubSubClient } from "@twurple/pubsub";
import { StaticAuthProvider } from "@twurple/auth";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../../../libs/types";
import { Redemption } from "../models/redemption.model";

const pubSub = async (
  accessToken: string,
  socket: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  console.log("PUB SUB TWITCH INIT");
  const clientId = process.env.CLIENT_ID!;

  const authProvider = new StaticAuthProvider(clientId, accessToken);

  const pubSubClient = new PubSubClient();
  const userId = await pubSubClient.registerUserListener(authProvider);

  pubSubClient.onRedemption(userId, async (reward) => {
    const {
      rewardId,
      userId,
      userName,
      userDisplayName,
      redemptionDate,
      rewardTitle,
      rewardCost,
      rewardImage,
      message,
    } = reward;

    const rewardData = {
      rewardId: rewardId,
      userId: userId,
      userName: userName,
      userDisplayName: userDisplayName,
      redemptionDate: redemptionDate,
      rewardTitle: rewardTitle,
      rewardCost: rewardCost,
      rewardImage: rewardImage,
      message: message,
    };

    try {
      await new Redemption(rewardData).save();
    } catch (err) {
      console.log(err, "Couldn't save redemption");
    }

    socket.emit("onRedemption", rewardData);
  });
};

export default pubSub;

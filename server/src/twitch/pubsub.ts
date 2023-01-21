import { PubSubClient } from "@twurple/pubsub";
import { StaticAuthProvider } from "@twurple/auth";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../../../libs/types";

const pubSub = async (
  accessToken: string,
  socket: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  const clientId = process.env.CLIENT_ID!;

  const authProvider = new StaticAuthProvider(clientId, accessToken);

  const pubSubClient = new PubSubClient();
  const userId = await pubSubClient.registerUserListener(authProvider);

  pubSubClient.onRedemption(userId, (reward) => {
    const rewardData = {
      rewardId: reward.rewardId,
      userId: reward.userId,
      userDisplayName: reward.userDisplayName,
      redemptionDate: reward.redemptionDate,
      rewardTitle: reward.rewardTitle,
      rewardCost: reward.rewardCost,
      rewardImage: reward.rewardImage,
      message: reward.message,
    };

    socket.emit("playRedemptionSound", rewardData);
  });
};

export default pubSub;

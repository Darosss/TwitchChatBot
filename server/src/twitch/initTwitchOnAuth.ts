import { StaticAuthProvider } from "@twurple/auth";
import eventSub from "./eventsub";
import { ApiClient } from "@twurple/api";
import * as ClientTmi from "../twitch-tmi";
import BotStatisticDatabase from "../chatbot/database-statistic";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";

const initTwitchOnAuth = async (
  authAccesToken: string,
  socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  const authProvider = new StaticAuthProvider(
    process.env.CLIENT_ID!,
    authAccesToken
  );
  const twitchApi = new ApiClient({ authProvider });

  const botStatisticDatabase = new BotStatisticDatabase(twitchApi);
  const TwitchTmi = ClientTmi.default(socketIO, botStatisticDatabase);
  TwitchTmi.connect();

  const authorizedUserId = (await twitchApi.users.getMe()).id;
  if (authorizedUserId) {
    eventSub(twitchApi, authorizedUserId, socketIO);
  }
};

export default initTwitchOnAuth;

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
import { Config } from "@models/config.model";

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
  const authorizedUser = await twitchApi.users.getMe();

  if (!authorizedUser) return;

  const configDB = await Config.findOne();
  const botStatisticDatabase = new BotStatisticDatabase(twitchApi, configDB!);
  await botStatisticDatabase.init();

  const TwitchTmi = ClientTmi.default(
    socketIO,
    botStatisticDatabase,
    authorizedUser.name
  );
  TwitchTmi.connect();

  eventSub(twitchApi, authorizedUser.id, socketIO);
};

export default initTwitchOnAuth;

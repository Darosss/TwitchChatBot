import { RefreshingAuthProvider } from "@twurple/auth";
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
import { IAuthorizationTwitch } from "@types";
import { AuthToken } from "@models/auth.model";
import { IAuth } from "@models/types";

const initTwitchOnAuth = async (
  authAccesToken: IAuthorizationTwitch,
  socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) => {
  const clientId = process.env.CLIENT_ID!;
  const clientSecret = process.env.CLIENT_SECRET!;

  await new AuthToken({
    accessToken: authAccesToken.access_token,
    refreshToken: authAccesToken.refresh_token,
  }).save();

  const authProvider = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
      onRefresh: async (newTokenData) => {
        await new AuthToken(newTokenData).save();
      },
    },
    (await AuthToken.findOne({})) as IAuth
  );

  const twitchApi = new ApiClient({ authProvider });
  const authorizedUser = await twitchApi.users.getMe();

  if (!authorizedUser) return;

  const configDB = await Config.findOne();
  if (!configDB) return;

  const botStatisticDatabase = new BotStatisticDatabase(twitchApi, configDB);
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

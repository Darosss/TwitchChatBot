import { RefreshingAuthProvider } from "@twurple/auth";
import eventSub from "./eventsub";
import { ApiClient } from "@twurple/api";
import * as ClientTmi from "./twitchClientTmi";
import BotStatisticDatabase from "../StreamHandler";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";
import { IAuthorizationTwitch } from "@types";
import { createNewAuth, createOrGetIfAuthValid } from "@services/auth";
import { getConfigs } from "@services/configs";

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

  const newAuthToken = await createOrGetIfAuthValid({
    accessToken: authAccesToken.access_token,
    refreshToken: authAccesToken.refresh_token,
    expiresIn: authAccesToken.expires_in,
    obtainmentTimestamp: new Date().getTime(),
    scope: authAccesToken.scope,
  });

  const authProvider = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
      onRefresh: async (newTokenData) => {
        await createNewAuth(newTokenData);
      },
    },
    newAuthToken
  );

  const twitchApi = new ApiClient({ authProvider });
  const authorizedUser = await twitchApi.users.getMe();

  if (!authorizedUser) return;

  const configDB = await getConfigs();
  if (!configDB) return;

  const botStatisticDatabase = new BotStatisticDatabase({
    twitchApi: twitchApi,
    config: configDB,
    socketIO: socketIO,
  });
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

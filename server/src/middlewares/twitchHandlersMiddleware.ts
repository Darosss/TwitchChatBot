import { RefreshingAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import * as ClientTmi from "./twitchClientTmi";
import StreamHandler from "../StreamHandler";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";
import { AuthorizationTwitch } from "@types";
import { createNewAuth, createOrGetIfAuthValid } from "@services/auth";
import { getConfigs } from "@services/configs";

const initTwitchOnAuth = async (
  authAccesToken: AuthorizationTwitch,
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

  const twitchTmi = ClientTmi.default({
    userToListen: authorizedUser.name,
  });

  const streamHandler = new StreamHandler({
    twitchApi: twitchApi,
    config: configDB,
    authorizedUser: authorizedUser,
    socketIO: socketIO,
    clientTmi: twitchTmi,
  });

  twitchTmi.connect();
};

export default initTwitchOnAuth;
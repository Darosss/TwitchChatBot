import { botUsername, botPassword, clientId, clientSecret, encryptionKey } from "@configs";
import { createNewAuth, getAuthToken, getConfigs, removeAuthToken } from "@services";
import { SocketHandler } from "@socket";
import { ApiClient } from "@twurple/api";
import { RefreshingAuthProvider, getTokenInfo } from "@twurple/auth";
import { ConfigModel } from "@models";
import { decryptToken } from "@utils";
import { AuthorizedUserData, HandlersList } from "./types";
import LoyaltyHandler from "./LoyaltyHandler";
import StreamHandler from "./StreamHandler";
import ClientTmiHandler from "./TwitchTmiHandler";
import EventSubHandler from "./EventSubHandler";
import TimersHandler from "./TimersHandler";
import CommandsHandler from "./CommandsHandler";
import TriggersHandler from "./TriggersHandler";
import MessagesHandler from "./MessagesHandler";
import AchievementsHandler from "./AchievementsHandler";

const INITIALIZED_HANDLERS: HandlersList = {};

interface InitializeHandlersArgs {
  twitchApi: ApiClient;
  authorizedUser: AuthorizedUserData;
}

interface CreateHandlersArgs extends InitializeHandlersArgs {
  configs: ConfigModel;
}

export const initializeHandlers = async (args: InitializeHandlersArgs) => {
  const configs = await getConfigs();

  if (!configs) throw new Error("Configs not found.");

  if (Object.keys(INITIALIZED_HANDLERS).length === 0) await createHandlers({ configs, ...args });
  else await updateHandlers({ configs, ...args });
};

const createHandlers = async ({ configs, twitchApi, authorizedUser }: CreateHandlersArgs) => {
  INITIALIZED_HANDLERS.clientTmi = new ClientTmiHandler({
    userToListen: authorizedUser.name,
    username: botUsername,
    password: botPassword
  });

  const sayInAuthorizedChannel = INITIALIZED_HANDLERS.clientTmi.say.bind(INITIALIZED_HANDLERS.clientTmi);

  INITIALIZED_HANDLERS.timersHandler = new TimersHandler(sayInAuthorizedChannel);
  INITIALIZED_HANDLERS.loyaltyHandler = new LoyaltyHandler(twitchApi, authorizedUser);
  INITIALIZED_HANDLERS.triggersHandler = new TriggersHandler();
  INITIALIZED_HANDLERS.messagesHandler = new MessagesHandler();

  INITIALIZED_HANDLERS.eventSubHandler = new EventSubHandler({
    apiClient: twitchApi,
    authorizedUser
  });
  INITIALIZED_HANDLERS.commandsHandler = new CommandsHandler();

  INITIALIZED_HANDLERS.streamHandler = new StreamHandler({
    configuration: { twitchApi, configs, authorizedUser },
    handlers: {
      clientTmi: INITIALIZED_HANDLERS.clientTmi,
      loyaltyHandler: INITIALIZED_HANDLERS.loyaltyHandler,
      eventSubHandler: INITIALIZED_HANDLERS.eventSubHandler,
      commandsHandler: INITIALIZED_HANDLERS.commandsHandler,
      timersHandler: INITIALIZED_HANDLERS.timersHandler,
      triggersHandler: INITIALIZED_HANDLERS.triggersHandler,
      messagesHandler: INITIALIZED_HANDLERS.messagesHandler
    }
  });
};

/** This should be only called when all handlers are !== undefined */
const updateHandlers = async ({ configs, twitchApi, authorizedUser }: CreateHandlersArgs) => {
  await INITIALIZED_HANDLERS.clientTmi?.disconnectTmi();
  await INITIALIZED_HANDLERS.clientTmi?.connect();
  INITIALIZED_HANDLERS.loyaltyHandler?.updateProperties(twitchApi, authorizedUser);
  INITIALIZED_HANDLERS.eventSubHandler?.updateOptions({
    apiClient: twitchApi,
    authorizedUser
  });

  INITIALIZED_HANDLERS.streamHandler?.updateOptions({
    configuration: { twitchApi, authorizedUser, configs },
    handlers: {
      clientTmi: INITIALIZED_HANDLERS.clientTmi!,
      loyaltyHandler: INITIALIZED_HANDLERS.loyaltyHandler!,
      eventSubHandler: INITIALIZED_HANDLERS.eventSubHandler!,
      commandsHandler: INITIALIZED_HANDLERS.commandsHandler!,
      timersHandler: INITIALIZED_HANDLERS.timersHandler!,
      triggersHandler: INITIALIZED_HANDLERS.triggersHandler!,
      messagesHandler: INITIALIZED_HANDLERS.messagesHandler!
    }
  });
};

const init = async () => {
  const authData = await initializeAuthToken();
  if (!authData) return;
  const tokeninfo = await getTokenInfo(authData.decryptedAccessToken);
  const authorizedUser: AuthorizedUserData = { id: tokeninfo.userId!, name: tokeninfo.userName! };
  const twitchApi = new ApiClient({ authProvider: authData.authProvider });

  if (!authorizedUser.id || !authorizedUser.name) {
    throw Error("Something went wrong, try login again");
  }
  await initializeHandlers({ twitchApi, authorizedUser });

  AchievementsHandler.getInstance();
  SocketHandler.getInstance().getIO().emit("forceReconnect");
};

const initializeAuthToken = async () => {
  const tokenDB = await getAuthToken();
  if (!tokenDB) return;

  const decryptedAccessToken = decryptToken(tokenDB.accessToken, tokenDB.ivAccessToken, encryptionKey);
  const decryptedRefreshToken = decryptToken(tokenDB.refreshToken, tokenDB.ivRefreshToken, encryptionKey);

  const authProvider = new RefreshingAuthProvider({
    clientId,
    clientSecret
  });

  authProvider.onRefresh(async (userId, newTokenData) => {
    const { accessToken, refreshToken, expiresIn, obtainmentTimestamp, scope } = newTokenData;
    await createNewAuth({
      accessToken: accessToken,
      refreshToken: refreshToken || "",
      expiresIn: expiresIn || 0,
      obtainmentTimestamp: obtainmentTimestamp,
      scope: scope,
      userId: userId
    });
  });
  try {
    await authProvider.addUserForToken({
      accessToken: decryptedAccessToken,
      refreshToken: decryptedRefreshToken,
      expiresIn: tokenDB.expiresIn,
      obtainmentTimestamp: tokenDB.obtainmentTimestamp
    });
  } catch (err) {
    if (err instanceof Error) {
      await removeAuthToken();
      throw new Error(`Error occured while trying to add user access token. Cleared auth token. Log in again`);
    } else throw new Error("An unknown error occured. ");
  }

  return { authProvider, decryptedAccessToken };
};

export default init;

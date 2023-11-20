/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { botUsername, botPassword } from "@configs";
import { getConfigs } from "@services";
import { ServerSocket } from "@socket";
import { ApiClient } from "@twurple/api";
import CommandsHandler from "./CommandsHandler";
import EventSubHandler from "./EventSubHandler";
import LoyaltyHandler from "./LoyaltyHandler";
import MessagesHandler from "./MessagesHandler";
import MusicStreamHandler from "./MusicStreamHandler";
import MusicYTHandler from "./MusicYTHandler";
import StreamHandler from "./StreamHandler";
import TriggersHandler from "./TriggersHandler";
import ClientTmiHandler from "./TwitchTmiHandler";
import { AuthorizedUserData, HandlersList } from "./types";
import { ConfigModel } from "@models";
import TimersHandler from "./TimersHandler";
import AchievementsHandler from "./AchievementsHandler";

const INITIALIZED_HANDLERS: HandlersList = {};

interface InitializeHandlersArgs {
  twitchApi: ApiClient;
  authorizedUser: AuthorizedUserData;
  socketIO: ServerSocket;
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

const createHandlers = async ({ configs, twitchApi, authorizedUser, socketIO }: CreateHandlersArgs) => {
  INITIALIZED_HANDLERS.clientTmi = new ClientTmiHandler({
    userToListen: authorizedUser.name,
    username: botUsername,
    password: botPassword
  });

  const {
    commandsConfigs,
    headConfigs,
    musicConfigs,
    pointsConfigs,
    triggersConfigs,
    loyaltyConfigs,
    timersConfigs,
    achievementsConfigs
  } = configs;
  const sayInAuthorizedChannel = INITIALIZED_HANDLERS.clientTmi.say.bind(INITIALIZED_HANDLERS.clientTmi);
  INITIALIZED_HANDLERS.achievementsHandler = new AchievementsHandler(socketIO, achievementsConfigs);

  INITIALIZED_HANDLERS.musicStreamHandler = new MusicStreamHandler(socketIO, sayInAuthorizedChannel, musicConfigs);
  INITIALIZED_HANDLERS.musicYTHandler = new MusicYTHandler(socketIO, sayInAuthorizedChannel, musicConfigs);
  INITIALIZED_HANDLERS.commandsHandler = new CommandsHandler(
    twitchApi,
    socketIO,
    authorizedUser,
    INITIALIZED_HANDLERS.musicYTHandler,
    {
      ...commandsConfigs,
      permissionLevels: headConfigs.permissionLevels
    },
    INITIALIZED_HANDLERS.achievementsHandler
  );

  INITIALIZED_HANDLERS.messagesHandler = new MessagesHandler(INITIALIZED_HANDLERS.achievementsHandler, pointsConfigs);
  INITIALIZED_HANDLERS.triggersHandler = new TriggersHandler(triggersConfigs);

  INITIALIZED_HANDLERS.loyaltyHandler = new LoyaltyHandler(
    twitchApi,
    socketIO,
    authorizedUser,
    {
      ...loyaltyConfigs,
      ...pointsConfigs
    },
    INITIALIZED_HANDLERS.achievementsHandler
  );

  INITIALIZED_HANDLERS.timersHandler = new TimersHandler(
    twitchApi,
    socketIO,
    authorizedUser,
    timersConfigs,
    sayInAuthorizedChannel
  );

  INITIALIZED_HANDLERS.eventSubHandler = new EventSubHandler({
    apiClient: twitchApi,
    socketIO,
    authorizedUser
  });

  INITIALIZED_HANDLERS.streamHandler = new StreamHandler({
    configuration: { twitchApi, configs, authorizedUser, socketIO },
    handlers: {
      clientTmi: INITIALIZED_HANDLERS.clientTmi,
      commandsHandler: INITIALIZED_HANDLERS.commandsHandler,
      triggersHandler: INITIALIZED_HANDLERS.triggersHandler,
      messagesHandler: INITIALIZED_HANDLERS.messagesHandler,
      loyaltyHandler: INITIALIZED_HANDLERS.loyaltyHandler,
      timersHandler: INITIALIZED_HANDLERS.timersHandler,
      musicStreamHandler: INITIALIZED_HANDLERS.musicStreamHandler,
      musicYTHandler: INITIALIZED_HANDLERS.musicYTHandler,
      eventSubHandler: INITIALIZED_HANDLERS.eventSubHandler
    }
  });
};

/** This should be only called when all handlers are !== undefined */
const updateHandlers = async ({ configs, twitchApi, authorizedUser, socketIO }: CreateHandlersArgs) => {
  await INITIALIZED_HANDLERS.clientTmi?.disconnectTmi();
  await INITIALIZED_HANDLERS.clientTmi?.connect();
  INITIALIZED_HANDLERS.commandsHandler?.updateProperties(twitchApi, authorizedUser);
  INITIALIZED_HANDLERS.eventSubHandler?.updateProperties(twitchApi, authorizedUser);
  INITIALIZED_HANDLERS.loyaltyHandler?.updateProperties(twitchApi, authorizedUser);
  INITIALIZED_HANDLERS.timersHandler?.updateProperties(twitchApi, authorizedUser);
  INITIALIZED_HANDLERS.eventSubHandler?.updateOptions({ apiClient: twitchApi, socketIO, authorizedUser });

  INITIALIZED_HANDLERS.streamHandler?.updateOptions({
    configuration: { twitchApi, authorizedUser, socketIO, configs },
    handlers: {
      clientTmi: INITIALIZED_HANDLERS.clientTmi!,
      commandsHandler: INITIALIZED_HANDLERS.commandsHandler!,
      triggersHandler: INITIALIZED_HANDLERS.triggersHandler!,
      messagesHandler: INITIALIZED_HANDLERS.messagesHandler!,
      loyaltyHandler: INITIALIZED_HANDLERS.loyaltyHandler!,
      timersHandler: INITIALIZED_HANDLERS.timersHandler!,
      musicStreamHandler: INITIALIZED_HANDLERS.musicStreamHandler!,
      musicYTHandler: INITIALIZED_HANDLERS.musicYTHandler!,
      eventSubHandler: INITIALIZED_HANDLERS.eventSubHandler!
    }
  });
};

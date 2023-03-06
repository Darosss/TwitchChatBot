import { ApiClient, HelixPrivilegedUser } from "@twurple/api";
import { IConfigDocument, IUser } from "@models/types";
import { IConfigDefaults } from "@defaults/types";
import { configDefaults } from "@defaults/configsDefaults";
import { SocketServer } from "@libs/types";

import {
  getCurrentStreamSession,
  updateStreamSessionById,
} from "@services/streamSessions";
import retryWithCatch from "@utils/retryWithCatchUtil";

import CommandsHandler from "./CommandsHandler";
import TriggersHandler from "./TriggersHandler";
import LoyaltyHandler from "./LoyaltyHandler";
import MessagesHandler from "./MessagesHandler";

interface IStreamHandlerOptions {
  config: IConfigDocument;
  twitchApi: ApiClient;
  socketIO: SocketServer;
  authorizedUser: HelixPrivilegedUser;
}

class StreamHandler {
  private twitchApi: ApiClient;
  private authorizedUser: HelixPrivilegedUser;

  private commandsHandler: CommandsHandler;
  private triggersHandler: TriggersHandler;
  private messagesHandler: MessagesHandler;
  private loayaltyHandler: LoyaltyHandler;
  private configTemp: IConfigDefaults;

  constructor(options: IStreamHandlerOptions) {
    const { twitchApi, socketIO, authorizedUser } = options;
    this.twitchApi = twitchApi;

    this.authorizedUser = authorizedUser;
    this.configTemp = { ...configDefaults };

    this.commandsHandler = new CommandsHandler(this.configTemp.commandsPrefix);
    this.messagesHandler = new MessagesHandler(this.configTemp.pointsIncrement);
    this.triggersHandler = new TriggersHandler();
    this.loayaltyHandler = new LoyaltyHandler(
      twitchApi,
      socketIO,
      this.authorizedUser,
      this.configTemp
    );

    this.init();
  }

  public async onMessageEvents(user: IUser, message: string) {
    let messagesToSend: string[] = [];
    const dataEvent = new Date();

    await this.messagesHandler.saveMessageAndUpdateUser(
      user._id,
      user.username,
      dataEvent,
      message
    );

    const commandAnswer = await this.commandsHandler.checkMessageForCommand(
      user,
      message
    );

    const triggerAnswer = await this.triggersHandler.checkMessageForTrigger(
      message
    );

    commandAnswer ? messagesToSend.push(commandAnswer) : null;
    triggerAnswer ? messagesToSend.push(triggerAnswer) : null;

    return messagesToSend;
  }
  // private async debugFollows() {
  //   const follows = await this.twitchApi.users.getFollows({
  //     followedUser: 147192097,
  //     limit: 100,
  //   });
  //   await addFollowersTemp(follows.data);
  // }
  async init() {
    const { id } = this.authorizedUser;
    setInterval(async () => {
      await this.checkCountOfViewers(id);
    }, this.configTemp.intervalCheckViewersPeek * 1000);
  }

  async checkCountOfViewers(broadcasterId: string) {
    const currentSession = await getCurrentStreamSession({});
    const streamInfo = await retryWithCatch(() =>
      this.twitchApi.streams.getStreamByUserId(broadcasterId)
    );

    if (!currentSession || !streamInfo) return;

    const viewersPeek = new Map<string, number>();
    viewersPeek.set(String(new Date().getTime()), streamInfo.viewers);
    const timestamp = Date.now();

    updateStreamSessionById(currentSession.id, {
      $set: { [`viewers.${timestamp}`]: streamInfo.viewers },
    });
  }

  // TODO: this is loyalty??

  // async updateEveryUserTwitchDetails(broadcasterId: string) {
  //   const limit = 50;
  //   let index = 0;

  //   const checkUsersTimer = setInterval(async () => {
  //     const usernames = await getTwitchNames(limit, limit * index);
  //     if (!usernames) return;

  //     const usersTwitch = await retryWithCatch(() =>
  //       this.twitchApi.users.getUsersByNames(usernames.twitchNames)
  //     );
  //     if (!usersTwitch) return;

  //     for await (const user of usersTwitch) {
  //       // const follower = await retryWithCatch(async () => {
  //       //   for await (const user of usersTwitch) {
  //       //     await user.getFollowTo(broadcasterId);
  //       //   }
  //       // });
  //       //   user.follower = follower?.followDate;
  //       //   await user.save();
  //       console.log("user", user.displayName);
  //     }

  //     index++;
  //     if (limit * index > usernames.total) {
  //       console.log("Finished checking users - clear interval");
  //       clearInterval(checkUsersTimer);
  //     }
  //   }, 10000);
  // }
}

export default StreamHandler;

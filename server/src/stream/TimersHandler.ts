import HeadHandler from "./HeadHandler";
import { ApiClient, HelixPrivilegedUser } from "@twurple/api";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@libs/types";
import { Server } from "socket.io";
import { getTimers, updateTimerById, updateTimers } from "@services/timers";
import { randomWithMax } from "@utils/randomNumbersUtil";
import { TimersConfigs, UserModel } from "@models/types";
import { timerLogger } from "@utils/loggerUtil";

class TimersHandler extends HeadHandler {
  private configs: TimersConfigs;
  private clientSay: (channel: string, message: string) => Promise<[string]>;

  constructor(
    twitchApi: ApiClient,
    socketIO: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >,
    authorizedUser: HelixPrivilegedUser,
    configs: TimersConfigs,
    clientSay: (channel: string, message: string) => Promise<[string]>
  ) {
    super(socketIO, twitchApi, authorizedUser);
    this.configs = configs;
    this.clientSay = clientSay;
    this.init();
  }

  private async init() {
    setInterval(async () => {
      await this.checkTimers(/* id */);
    }, this.configs.timersIntervalDelay * 255);
  }

  async refreshConfigs(refreshedConfigs: TimersConfigs) {
    this.configs = refreshedConfigs;
  }

  async refreshTimers() {
    //TODO: add refresh timers
  }

  async checkTimers() {
    const timers = await getTimers(
      { $expr: { $gte: ["$points", "$reqPoints"] } },
      {}
    );

    timers?.forEach((timer, index) => {
      setTimeout(async () => {
        const { _id, name, messages } = timer;
        const timerMessage = messages[randomWithMax(messages.length)];
        timerLogger.info(
          `Timer ${name} with message: ${timerMessage} - points >= requiredPoints`
        );

        this.clientSay(this.authorizedUser.name, timerMessage);

        await this.updateTimerAfterUsage(_id);
      }, index * 2000);
    });
  }

  async checkMessageForTimer(user: UserModel) {
    await this.updateTimersAfterMessages(user.follower ? true : false);
  }

  async updateTimersAfterMessages(follower: boolean) {
    const arrayPromises = [];
    if (!follower) arrayPromises.push(this.updateNonFollowsTimers());
    //TODO: if(!sub) // add later

    arrayPromises.push(this.updateDefaultsTimers());

    Promise.all(arrayPromises);
  }

  async updateNonFollowsTimers() {
    const updatedTimers = await updateTimers(
      { nonFollowMulti: true },
      { $inc: { points: 6 } }
    );

    return updatedTimers;
  }

  async updateNonSubsTimers() {
    const updatedTimers = await updateTimers(
      { nonSubMulti: true },
      { $inc: { points: 10 } }
    );
  }

  async updateDefaultsTimers() {
    const updatedTimers = await updateTimers({}, { $inc: { points: 1 } });
  }

  async updateTimerAfterUsage(id: string) {
    const updatedTrigger = await updateTimerById(id, {
      $inc: { uses: 1 },
      points: 0,
    });
  }
}
export default TimersHandler;

import HeadHandler from "./HeadHandler";
import { ApiClient, HelixPrivilegedUser } from "@twurple/api";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@libs/types";
import { Server } from "socket.io";
import {
  getTimerById,
  getTimers,
  getTimersDataWithModesEnabled,
  updateEnabledTimersAndEnabledModes,
  updateTimerById,
} from "@services/timers";
import { randomWithMax } from "@utils/randomNumbersUtil";
import { TimerModel, TimersConfigs, UserModel } from "@models/types";
import { timerLogger } from "@utils/loggerUtil";

class TimersHandler extends HeadHandler {
  private configs: TimersConfigs;
  private clientSay: (message: string) => void;
  private timers: TimerModel[] = [];
  private timersTimeouts: Map<string, NodeJS.Timeout> = new Map();

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
    clientSay: (message: string) => void
  ) {
    super(socketIO, twitchApi, authorizedUser);
    this.configs = configs;
    this.clientSay = clientSay;
    this.init();
  }

  private async init() {
    await this.refreshTimers();
    setInterval(async () => {
      await this.checkTimersByPoints();
    }, this.configs.timersIntervalDelay * 1000);
  }

  async refreshConfigs(refreshedConfigs: TimersConfigs) {
    this.configs = refreshedConfigs;
  }

  async refreshTimers() {
    this.timers = (await getTimersDataWithModesEnabled()) || [];

    this.clearTimersTimeouts();
    this.setTimersTimeouts();
  }

  clearTimersTimeouts() {
    for (const timeout of this.timersTimeouts.values()) {
      clearTimeout(timeout);
    }
    this.timersTimeouts.clear();
  }

  async setTimersTimeouts() {
    this.timers.map((timer) => {
      const { _id, name, delay } = timer;
      this.setTimerTimeout(_id, name, delay);
    });
  }

  setTimerTimeout(id: string, name: string, delay: number) {
    this.timersTimeouts.set(
      id,
      setTimeout(async () => {
        const timerMessage = await this.getTimerMessage(id);

        timerLogger.info(
          `Timer ${name} with message: ${timerMessage} - delay finished`
        );
        this.clientSay(timerMessage);
        await this.updateTimerAfterUsage(id);
        this.setTimerTimeout(id, name, delay);
      }, delay * 1000)
    );
  }

  async getTimerMessage(id: string) {
    const timer = await getTimerById(id);
    if (!timer) return "";
    return timer.messages[randomWithMax(timer.messages.length)];
  }

  async checkTimersByPoints() {
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

        this.clientSay(timerMessage);

        await this.updateTimerAfterUsage(_id);
      }, index * 2000);
    });
  }

  async setTimersByDelay() {}

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
    const updatedTimers = await updateEnabledTimersAndEnabledModes(
      this.configs.nonFollowTimerPoints,
      { nonFollowMulti: false }
    );

    return updatedTimers;
  }

  async updateNonSubsTimers() {
    const updatedTimers = await updateEnabledTimersAndEnabledModes(
      this.configs.nonSubTimerPoints,
      { nonSubMulti: false }
    );
  }

  async updateDefaultsTimers() {
    const updatedTimers = await updateEnabledTimersAndEnabledModes(1, {});

    return updatedTimers;
  }

  async updateTimerAfterUsage(id: string) {
    const updatedTrigger = await updateTimerById(id, {
      $inc: { uses: 1 },
      points: 0,
    });
  }
}
export default TimersHandler;

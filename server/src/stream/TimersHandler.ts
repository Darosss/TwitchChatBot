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
import { percentChance, randomWithMax } from "@utils/randomNumbersUtil";
import { MoodModel, TimerModel, TimersConfigs, UserModel } from "@models/types";
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

  public async refreshConfigs(refreshedConfigs: TimersConfigs) {
    this.configs = refreshedConfigs;
  }

  public async refreshTimers() {
    this.timers = (await getTimersDataWithModesEnabled()) || [];

    this.clearTimersTimeouts();
    this.setTimersTimeouts();
  }

  private clearTimersTimeouts() {
    for (const timeout of this.timersTimeouts.values()) {
      clearTimeout(timeout);
    }
    this.timersTimeouts.clear();
  }

  private async setTimersTimeouts() {
    this.timers.map((timer) => {
      const { _id, name, delay } = timer;
      this.setTimerTimeout(_id, name, delay);
    });
  }

  private setTimerTimeout(id: string, name: string, delay: number) {
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

  private async getTimerMessage(id: string) {
    const timer = await getTimerById(id, {}, { populateSelect: "mood" });
    if (!timer) return "";

    const getPrefix = this.shouldGetPrefix();
    const getSufix = this.shouldGetSufix();

    const { prefixes, sufixes } = timer.mood as MoodModel;

    let prefix = "";
    let sufix = "";

    if (getPrefix) prefix = prefixes[randomWithMax(prefixes.length)];
    if (getSufix) sufix = sufixes[randomWithMax(sufixes.length)];

    timerLogger.info(
      `Add prefix - ${prefix} and sufix - ${sufix} to timer message`
    );

    return `${prefix} ${
      timer.messages[randomWithMax(timer.messages.length)]
    } ${sufix}`;
  }

  private shouldGetPrefix() {
    if (percentChance(this.configs.prefixChance)) {
      return true;
    }
    return false;
  }
  private shouldGetSufix() {
    if (percentChance(this.configs.sufixChance)) {
      return true;
    }
    return false;
  }

  private async checkTimersByPoints() {
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

  public async checkMessageForTimer(user: UserModel) {
    await this.updateTimersAfterMessages(user.follower ? true : false);
  }

  private async updateTimersAfterMessages(follower: boolean) {
    const arrayPromises = [];
    if (!follower) arrayPromises.push(this.updateNonFollowsTimers());
    //TODO: if(!sub) // add later

    arrayPromises.push(this.updateDefaultsTimers());

    Promise.all(arrayPromises);
  }

  private async updateNonFollowsTimers() {
    const updatedTimers = await updateEnabledTimersAndEnabledModes(
      this.configs.nonFollowTimerPoints,
      { nonFollowMulti: false }
    );

    return updatedTimers;
  }

  private async updateNonSubsTimers() {
    //TODO: add usage in future
    const updatedTimers = await updateEnabledTimersAndEnabledModes(
      this.configs.nonSubTimerPoints,
      { nonSubMulti: false }
    );
  }

  private async updateDefaultsTimers() {
    const updatedTimers = await updateEnabledTimersAndEnabledModes(1, {});

    return updatedTimers;
  }

  private async updateTimerAfterUsage(id: string) {
    const updatedTrigger = await updateTimerById(id, {
      $inc: { uses: 1 },
      points: 0,
    });
  }
}
export default TimersHandler;

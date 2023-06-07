import HeadHandler from "./HeadHandler";
import { ApiClient } from "@twurple/api";
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@socket";
import { Server } from "socket.io";
import {
  getTimerById,
  getTimers,
  getTimersDataWithModesEnabled,
  updateEnabledTimersAndEnabledModes,
  updateTimerById
} from "@services/timers";
import { percentChance, randomWithMax } from "@utils/randomNumbersUtil";
import { TimerModel, TimersConfigs, UserModel } from "@models/types";
import { timerLogger } from "@utils/loggerUtil";
import { getEnabledSuffixesAndPrefixes, getMultiperEnabledAfixesChances } from "@services/affixes";
import { AuthorizedUserData } from "./types";

class TimersHandler extends HeadHandler {
  private configs: TimersConfigs;
  private clientSay: (message: string) => void;
  private timers: TimerModel[] = [];
  private timersTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private affixesMultipler = { prefixMult: 1, suffixMult: 1 };

  constructor(
    twitchApi: ApiClient,
    socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    authorizedUser: AuthorizedUserData,
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

    await this.updateAffixesMultiplers();

    setInterval(async () => {
      await this.checkTimersByPoints();
    }, this.configs.timersIntervalDelay * 1000);
  }

  public async refreshConfigs(refreshedConfigs: TimersConfigs) {
    this.configs = refreshedConfigs;
    await this.updateAffixesMultiplers();
  }

  public async refreshTimers() {
    this.timers = (await getTimersDataWithModesEnabled()) || [];

    this.clearTimersTimeouts();
    this.setTimersTimeouts();

    await this.updateAffixesMultiplers();
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

        timerLogger.info(`Timer ${name} with message: ${timerMessage} - delay finished`);
        this.clientSay(timerMessage);
        await this.updateTimerAfterUsage(id);
        this.setTimerTimeout(id, name, delay);
      }, delay * 1000)
    );
  }

  private async updateAffixesMultiplers() {
    const { prefixesMultipler, suffixesMultipler } = await getMultiperEnabledAfixesChances();

    this.affixesMultipler.prefixMult = prefixesMultipler;
    this.affixesMultipler.suffixMult = suffixesMultipler;
  }

  private async getTimerMessage(id: string) {
    const timer = await getTimerById(id, {}, { populateSelect: "mood" });
    if (!timer) return "";

    const [prefix, suffix] = await this.getRandomEnabledAffixes();

    return `${prefix} ${timer.messages[randomWithMax(timer.messages.length)]} ${suffix}`;
  }

  private async getRandomEnabledAffixes() {
    const { prefixes, suffixes } = await getEnabledSuffixesAndPrefixes();

    const getPrefix = this.shouldGetPrefix();
    const getsuffix = this.shouldGetsuffix();
    let prefix = "";
    let suffix = "";

    if (getPrefix) prefix = prefixes[randomWithMax(prefixes.length)];
    if (getsuffix) suffix = suffixes[randomWithMax(suffixes.length)];

    timerLogger.info(`Add prefix - ${prefix} and suffix - ${suffix} to timer message`);

    return [prefix, suffix];
  }

  private shouldGetPrefix() {
    const prefixChance = this.configs.prefixChance * this.affixesMultipler.prefixMult;
    if (percentChance(prefixChance)) {
      return true;
    }
    return false;
  }
  private shouldGetsuffix() {
    const suffixChance = this.configs.suffixChance * this.affixesMultipler.suffixMult;
    if (percentChance(suffixChance)) {
      return true;
    }
    return false;
  }

  private async checkTimersByPoints() {
    const timers = await getTimers({ $expr: { $gte: ["$points", "$reqPoints"] } }, {});

    timers?.forEach((timer, index) => {
      setTimeout(async () => {
        const { _id, name, messages } = timer;
        const timerMessage = messages[randomWithMax(messages.length)];
        timerLogger.info(`Timer ${name} with message: ${timerMessage} - points >= requiredPoints`);

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
    const updatedTimers = await updateEnabledTimersAndEnabledModes(this.configs.nonFollowTimerPoints, {
      nonFollowMulti: false
    });

    return updatedTimers;
  }

  private async updateNonSubsTimers() {
    //TODO: add usage in future
    const updatedTimers = await updateEnabledTimersAndEnabledModes(this.configs.nonSubTimerPoints, {
      nonSubMulti: false
    });

    return updatedTimers;
  }

  private async updateDefaultsTimers() {
    const updatedTimers = await updateEnabledTimersAndEnabledModes(1, {});

    return updatedTimers;
  }

  private async updateTimerAfterUsage(id: string) {
    const updatedTrigger = await updateTimerById(id, {
      $inc: { uses: 1 },
      points: 0
    });

    return updatedTrigger;
  }
}
export default TimersHandler;

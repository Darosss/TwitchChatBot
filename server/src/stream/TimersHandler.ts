import {
  getTimerById,
  getTimers,
  getTimersDataWithModesEnabled,
  updateEnabledTimersAndEnabledModes,
  updateTimerById,
  getEnabledSuffixesAndPrefixes,
  getMultiperEnabledAfixesChances
} from "@services";
import { percentChance, randomWithMax, timerLogger } from "@utils";
import { ConfigModel, TimerModel, UserModel } from "@models";
import { ConfigManager } from "./ConfigManager";

type OnTimerExecute = (message: string) => void;

class TimersHandler {
  private configs: ConfigModel = ConfigManager.getInstance().getConfig();
  private timers: TimerModel[] = [];
  private timersTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private affixesMultipler = { prefixMult: 1, suffixMult: 1 };
  private _onTimerExecute: OnTimerExecute;

  constructor(onTimerExecute: OnTimerExecute) {
    ConfigManager.getInstance().registerObserver(this.handleConfigUpdate.bind(this));
    this._onTimerExecute = onTimerExecute;
    this.init();
  }

  public set onTimerExecute(value: (message: string) => void) {
    this._onTimerExecute = value;
  }

  private async init() {
    await this.refreshTimers();

    await this.updateAffixesMultiplers();

    setInterval(async () => {
      await this.checkTimersByPoints();
    }, this.configs.timersConfigs.timersIntervalDelay * 1000);
  }

  private async handleConfigUpdate(newConfigs: ConfigModel) {
    this.configs = newConfigs;
    this.refreshTimers();
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
        if (this._onTimerExecute) this._onTimerExecute(timerMessage);
        else timerLogger.warn("In order to execute timer message provide and set _onTimerExecute in TimersHandler");
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
    const timer = await getTimerById(id, {}, { populate: { path: "mood" } });
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
    const prefixChance = this.configs.timersConfigs.prefixChance * this.affixesMultipler.prefixMult;
    if (percentChance(prefixChance)) {
      return true;
    }
    return false;
  }
  private shouldGetsuffix() {
    const suffixChance = this.configs.timersConfigs.suffixChance * this.affixesMultipler.suffixMult;
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

        if (this._onTimerExecute) this._onTimerExecute(timerMessage);
        else timerLogger.warn("In order to execute timer message provide and set _onTimerExecute in TimersHandler");

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
    const updatedTimers = await updateEnabledTimersAndEnabledModes(this.configs.timersConfigs.nonFollowTimerPoints, {
      nonFollowMulti: false
    });

    return updatedTimers;
  }

  private async updateNonSubsTimers() {
    //TODO: add usage in future
    const updatedTimers = await updateEnabledTimersAndEnabledModes(this.configs.timersConfigs.nonSubTimerPoints, {
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

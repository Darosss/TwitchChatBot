import { TriggerModel, TriggerMode, MoodModel, ConfigModel } from "@models";
import {
  getEnabledSuffixesAndPrefixes,
  getMultiperEnabledAfixesChances,
  findCategoryAndUpdateMessageUse,
  getLeastMessagesFromEnabledCategories,
  getOneTrigger,
  getTriggersWords,
  updateTriggerById,
  updateTriggers
} from "@services";
import { percentChance, randomWithMax, triggerLogger } from "@utils";
import { ConfigManager } from "./ConfigManager";
import { SocketHandler } from "@socket";

class TriggersHandler {
  private configs: ConfigModel = ConfigManager.getInstance().getConfig();
  private triggersWords: string[] = [];
  private triggersOnDelay: Map<string, NodeJS.Timeout> = new Map();
  private affixesMultipler = { prefixMult: 1, suffixMult: 1 };

  constructor() {
    ConfigManager.getInstance().registerObserver(this.handleConfigUpdate.bind(this));
    SocketHandler.getInstance().subscribe("refreshTriggers", this.refreshTriggers.bind(this));
    SocketHandler.getInstance().subscribe("changeModes", this.refreshTriggers.bind(this));

    this.init();
  }

  private async init() {
    Promise.all([this.refreshTriggers(), this.setEveryTriggerDelayOff(), this.updateAffixesMultiplers()]);
  }

  private async refreshTriggers() {
    this.triggersWords = (await getTriggersWords(true)) || [];
    triggerLogger.info(`refreshTriggers invoked: [${this.triggersWords.join(" | ")}]`);

    await this.updateAffixesMultiplers();
  }

  private async handleConfigUpdate(newConfig: ConfigModel) {
    this.configs = newConfig;

    await this.updateAffixesMultiplers();
  }

  private async setEveryTriggerDelayOff() {
    await updateTriggers({}, { onDelay: false });
  }

  private async updateAffixesMultiplers() {
    const { prefixesMultipler, suffixesMultipler } = await getMultiperEnabledAfixesChances();

    this.affixesMultipler.prefixMult = prefixesMultipler;
    this.affixesMultipler.suffixMult = suffixesMultipler;
  }

  private async getTriggerWordAndTrigger(message: string) {
    let wordInMessage = "";
    const triggerWord = this.triggersWords.find((word) => {
      if (message.toLowerCase().includes(word)) {
        const index = message.toLowerCase().indexOf(word);
        const start = message.lastIndexOf(" ", index) + 1;
        const end = message.indexOf(" ", index);
        wordInMessage = end === -1 ? message.substring(start) : message.substring(start, end);
        return true;
      }
    });
    wordInMessage = wordInMessage.replace(/[.,]/g, "").toLowerCase();
    return { triggerWord, wordInMessage };
  }

  public async checkMessageForTrigger(message: string) {
    const { triggerWord, wordInMessage } = await this.getTriggerWordAndTrigger(message);
    if (triggerWord) {
      const foundedTrigger = await this.getTriggerByTriggerWord(triggerWord);

      if (!foundedTrigger) return false;

      const canSendTrigger = await this.checkTriggersConditions(foundedTrigger, triggerWord, wordInMessage);

      if (canSendTrigger) {
        return await this.getMessageAndUpdateTriggerLogic(foundedTrigger);
      }
    } else if (this.canSendRandomMessage()) {
      const randomMessage = await this.getRandomMessage();
      triggerLogger.info(`Not found trigger, but executing random message: ${randomMessage}`);

      return randomMessage;
    }
  }

  private canSendRandomMessage() {
    if (percentChance(this.configs.triggersConfigs.randomMessageChance)) return true;
    return false;
  }

  private async getRandomMessage() {
    try {
      const messagesWord = await getLeastMessagesFromEnabledCategories(true, 3);

      const [randomMessage, categoryId] = messagesWord[randomWithMax(messagesWord.length)];

      const [prefix, suffix] = await this.getRandomEnabledAFfixes();

      if (categoryId) {
        await this.updateUsedMessageInCategory(categoryId, randomMessage);
      }

      return `${prefix} ${randomMessage} ${suffix}`;
    } catch (err) {
      triggerLogger.info(`Error occured while getting random category message`);
    }
  }

  private shouldGetPrefix() {
    const prefixChance = this.configs.triggersConfigs.prefixChance * this.affixesMultipler.prefixMult;
    if (percentChance(prefixChance)) {
      return true;
    }
    return false;
  }
  private shouldGetsuffix() {
    const suffixChance = this.configs.triggersConfigs.suffixChance * this.affixesMultipler.suffixMult;
    if (percentChance(suffixChance)) {
      return true;
    }
    return false;
  }

  private async updateUsedMessageInCategory(id: string, word: string) {
    const updatedCat = findCategoryAndUpdateMessageUse(id, word);
    return updatedCat;
  }

  private async checkTriggersConditions(trigger: TriggerModel, triggerWord: string, wordInMessage: string) {
    const { name, onDelay, chance, mode } = trigger;
    if (
      percentChance(chance) &&
      !(await this.isTriggerOnDelay(name, onDelay)) &&
      (await this.checkIfCanSendTrigger(mode, wordInMessage, triggerWord))
    ) {
      return true;
    }
    return false;
  }

  private async getMessageAndUpdateTriggerLogic(trigger: TriggerModel) {
    const { _id, name, mood, messages, delay } = trigger;
    const triggerMessage = await this.getTriggerMessage(mood as MoodModel, messages);
    await this.updateTrigerAfterUsage(_id);

    await this.setTimeoutRefreshTriggerDelay(_id, name, delay);
    triggerLogger.info(`Use ${name} trigger, delay: ${delay}s`);

    return triggerMessage;
  }

  private async checkIfCanSendTrigger(mode: TriggerMode, wholeWord: string, triggerWord: string) {
    switch (mode) {
      case "WHOLE-WORD":
        if (wholeWord !== triggerWord) {
          triggerLogger.info(`WHOLE-WORD: Trigger - trigger word (${triggerWord} != ${wholeWord}). Not sending`);
          return false;
        }
        break;
      case "STARTS-WITH":
        if (!wholeWord.startsWith(triggerWord)) {
          triggerLogger.info(`STARTS-WITH: Trigger not starting with word (${triggerWord}  ${wholeWord}). Not sending`);
          return false;
        }
        break;
    }

    return true;
  }

  private async isTriggerOnDelay(name: string, onDelay: boolean) {
    if (onDelay || this.triggersOnDelay.has(name)) {
      triggerLogger.info(`Trigger ${name} on delay - do nothing`);
      return true;
    }

    return false;
  }

  private async getTriggerMessage(mood: MoodModel, messages: string[]) {
    const [prefix, suffix] = await this.getRandomEnabledAFfixes();

    return `${prefix} ${messages[randomWithMax(messages.length)]} ${suffix}`;
  }

  private async getRandomEnabledAFfixes() {
    const { prefixes, suffixes } = await getEnabledSuffixesAndPrefixes();

    const getPrefix = this.shouldGetPrefix();
    const getsuffix = this.shouldGetsuffix();
    let prefix = "";
    let suffix = "";

    if (getPrefix) prefix = prefixes[randomWithMax(prefixes.length)];
    if (getsuffix) suffix = suffixes[randomWithMax(suffixes.length)];

    triggerLogger.info(`Add prefix - ${prefix} and suffix - ${suffix} to message`);

    return [prefix, suffix];
  }

  private async getTriggerByTriggerWord(triggerWord: string) {
    try {
      const foundedTrigger = await getOneTrigger(
        {
          words: { $regex: new RegExp(`\\b${triggerWord}\\b`, "i") }
        },
        { populate: { path: "mood" } }
      );
      return foundedTrigger;
    } catch (err) {}
  }

  private async updateTrigerAfterUsage(id: string) {
    const updatedTrigger = await updateTriggerById(id, {
      onDelay: true,
      $inc: { uses: 1 }
    });
    return updatedTrigger;
  }

  private async setTimeoutRefreshTriggerDelay(id: string, name: string, delay: number) {
    this.triggersOnDelay.set(
      name,
      setTimeout(async () => {
        await updateTriggerById(id, {
          onDelay: false
        });

        this.triggersOnDelay.delete(name);
        triggerLogger.info(`${name} - is now turn on again!`);
      }, delay * 1000)
    );
  }
}
export default TriggersHandler;

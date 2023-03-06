import { ITrigger, TTriggerMode } from "@models/types";
import {
  getRandomCategoryMessage,
  getRandomMessageFromCategory,
} from "@services/messageCategories";
import {
  getOneTrigger,
  getTriggersWords,
  updateTriggerById,
  updateTriggers,
} from "@services/triggers";
import { triggerLogger } from "@utils/loggerUtil";
import { percentChance, randomWithMax } from "@utils/randomNumbersUtil";
import { ITriggersHandlerConfigs } from "./types";

class TriggersHandler {
  private configs: ITriggersHandlerConfigs;
  private triggersWords: string[] = [];
  private triggersOnDelay: Map<string, NodeJS.Timeout> = new Map();

  constructor(configs: ITriggersHandlerConfigs) {
    this.configs = configs;
    this.init();
  }

  private async init() {
    Promise.all([this.refreshTriggers(), this.setEveryTriggerDelayOff()]);
  }

  async refreshTriggers() {
    this.triggersWords = (await getTriggersWords()) || [];
  }

  async refreshConfigs(refreshedConfigs: ITriggersHandlerConfigs) {
    this.configs = refreshedConfigs;
  }

  private async setEveryTriggerDelayOff() {
    await updateTriggers({}, { onDelay: false });
  }

  async getTriggerWordAndTrigger(message: string) {
    let wordInMessage = "";
    const triggerWord = this.triggersWords.find((word) => {
      if (message.toLowerCase().includes(word)) {
        const index = message.toLowerCase().indexOf(word);
        const start = message.lastIndexOf(" ", index) + 1;
        const end = message.indexOf(" ", index);
        wordInMessage =
          end === -1 ? message.substring(start) : message.substring(start, end);
        return true;
      }
    });
    wordInMessage = wordInMessage.replace(/[.,]/g, "").toLowerCase();
    return { triggerWord, wordInMessage };
  }

  async checkMessageForTrigger(message: string) {
    const { triggerWord, wordInMessage } = await this.getTriggerWordAndTrigger(
      message
    );
    if (triggerWord) {
      const foundedTrigger = await this.getTriggerByTriggerWord(triggerWord);

      if (!foundedTrigger) return false;

      const canSendTrigger = await this.checkTriggersConditions(
        foundedTrigger,
        triggerWord,
        wordInMessage
      );

      if (canSendTrigger) {
        return await this.getMessageAndUpdateTriggerLogic(foundedTrigger);
      }
    } else if (this.canSendRandomMessage()) {
      const randomMessage = await this.getRandomMessage();
      triggerLogger.info(
        `Not found trigger, but executing random message: ${randomMessage}`
      );

      return randomMessage;
    }
  }

  canSendRandomMessage() {
    if (percentChance(this.configs.randomMessageChance)) return true;
    return false;
  }

  async getRandomMessage() {
    try {
      const randomCategoryMessage = await getRandomCategoryMessage();
      if (!randomCategoryMessage) return;
      return await getRandomMessageFromCategory(randomCategoryMessage);
    } catch (err) {
      triggerLogger.info(`Error occured while getting random category message`);
    }
  }

  async checkTriggersConditions(
    trigger: ITrigger,
    triggerWord: string,
    wordInMessage: string
  ) {
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

  async getMessageAndUpdateTriggerLogic(trigger: ITrigger) {
    const { _id, messages, name, delay } = trigger;
    const triggerMessage = await this.getTriggerMessage(messages);
    await this.updateTrigerAfterUsage(_id);

    await this.setTimeoutRefreshTriggerDelay(_id, name, delay);
    triggerLogger.info(`Use ${name} trigger, delay: ${delay}s`);

    return triggerMessage;
  }

  async checkIfCanSendTrigger(
    mode: TTriggerMode,
    wholeWord: string,
    triggerWord: string
  ) {
    switch (mode) {
      case "WHOLE-WORD":
        if (wholeWord !== triggerWord) {
          triggerLogger.info(
            `WHOLE-WORD: Trigger - trigger word (${triggerWord} != ${wholeWord}). Not sending`
          );
          return false;
        }
        break;
      case "STARTS-WITH":
        if (!wholeWord.startsWith(triggerWord)) {
          triggerLogger.info(
            `STARTS-WITH: Trigger not starting with word (${triggerWord}  ${wholeWord}). Not sending`
          );
          return false;
        }
        break;
    }

    return true;
  }

  async isTriggerOnDelay(name: string, onDelay: boolean) {
    if (onDelay || this.triggersOnDelay.has(name)) {
      triggerLogger.info(`Trigger ${name} on delay - do nothing`);
      return true;
    }

    return false;
  }

  async getTriggerMessage(messages: string[]) {
    return messages[randomWithMax(messages.length)];
  }

  async getTriggerByTriggerWord(triggerWord: string) {
    try {
      const foundedTrigger = await getOneTrigger({
        words: { $regex: new RegExp(`\\b${triggerWord}\\b`, "i") },
      });
      return foundedTrigger;
    } catch (err) {}
  }

  async updateTrigerAfterUsage(id: string) {
    const updatedTrigger = await updateTriggerById(id, {
      onDelay: true,
      $inc: { uses: 1 },
    });
  }

  async setTimeoutRefreshTriggerDelay(id: string, name: string, delay: number) {
    this.triggersOnDelay.set(
      name,
      setTimeout(async () => {
        const refreshedTrigger = await updateTriggerById(id, {
          onDelay: false,
        });

        this.triggersOnDelay.delete(name);
        triggerLogger.info(`${name} - is now turn on again!`);
      }, delay * 1000)
    );
  }
}
export default TriggersHandler;

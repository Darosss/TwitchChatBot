import { TriggerModel, TriggerMode, TriggersConfigs } from "@models/types";
import {
  findCategoryAndUpdateMessageUse,
  getLeastUsedMessagesFromMessageCategory,
  getRandomCategoryMessage,
} from "@services/messageCategories";
import {
  getOneTrigger,
  getTriggersWords,
  updateTriggerById,
  updateTriggers,
} from "@services/triggers";
import { triggerLogger } from "@utils/loggerUtil";
import { percentChance, randomWithMax } from "@utils/randomNumbersUtil";

class TriggersHandler {
  private configs: TriggersConfigs;
  private triggersWords: string[] = [];
  private triggersOnDelay: Map<string, NodeJS.Timeout> = new Map();

  constructor(configs: TriggersConfigs) {
    this.configs = configs;
    this.init();
  }

  private async init() {
    Promise.all([this.refreshTriggers(), this.setEveryTriggerDelayOff()]);
  }

  public async refreshTriggers() {
    this.triggersWords = (await getTriggersWords(true)) || [];
  }

  public async refreshConfigs(configs: TriggersConfigs) {
    this.configs = configs;
  }

  private async setEveryTriggerDelayOff() {
    await updateTriggers({}, { onDelay: false });
  }

  private async getTriggerWordAndTrigger(message: string) {
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

  public async checkMessageForTrigger(message: string) {
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

  private canSendRandomMessage() {
    if (percentChance(this.configs.randomMessageChance)) return true;
    return false;
  }

  private async getRandomMessage() {
    try {
      const randomCategoryMessage = await getRandomCategoryMessage(true);
      if (!randomCategoryMessage) return;

      const messagesWord = await getLeastUsedMessagesFromMessageCategory(
        randomCategoryMessage._id,
        3
      );

      const choosenRandomMessage =
        messagesWord[randomWithMax(messagesWord.length)];

      if (choosenRandomMessage) {
        await this.updateUsedMessageInCategory(
          randomCategoryMessage._id,
          choosenRandomMessage
        );
      }

      return choosenRandomMessage;
    } catch (err) {
      triggerLogger.info(`Error occured while getting random category message`);
    }
  }

  private async updateUsedMessageInCategory(id: string, word: string) {
    const upd = findCategoryAndUpdateMessageUse(id, word);
  }

  private async checkTriggersConditions(
    trigger: TriggerModel,
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

  private async getMessageAndUpdateTriggerLogic(trigger: TriggerModel) {
    const { _id, messages, name, delay } = trigger;
    const triggerMessage = await this.getTriggerMessage(messages);
    await this.updateTrigerAfterUsage(_id);

    await this.setTimeoutRefreshTriggerDelay(_id, name, delay);
    triggerLogger.info(`Use ${name} trigger, delay: ${delay}s`);

    return triggerMessage;
  }

  private async checkIfCanSendTrigger(
    mode: TriggerMode,
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

  private async isTriggerOnDelay(name: string, onDelay: boolean) {
    if (onDelay || this.triggersOnDelay.has(name)) {
      triggerLogger.info(`Trigger ${name} on delay - do nothing`);
      return true;
    }

    return false;
  }

  private async getTriggerMessage(messages: string[]) {
    return messages[randomWithMax(messages.length)];
  }

  private async getTriggerByTriggerWord(triggerWord: string) {
    try {
      const foundedTrigger = await getOneTrigger({
        words: { $regex: new RegExp(`\\b${triggerWord}\\b`, "i") },
      });
      return foundedTrigger;
    } catch (err) {}
  }

  private async updateTrigerAfterUsage(id: string) {
    const updatedTrigger = await updateTriggerById(id, {
      onDelay: true,
      $inc: { uses: 1 },
    });
  }

  private async setTimeoutRefreshTriggerDelay(
    id: string,
    name: string,
    delay: number
  ) {
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

import { ITrigger } from "@models/types";
import {
  getOneTrigger,
  getTriggersWords,
  updateTriggerById,
} from "@services/triggers";
import { triggerLogger } from "@utils/loggerUtil";
import { randomWithMax } from "@utils/randomNumbersUtil";

class TriggersHandler {
  private triggersWords: string[] = [];
  private triggersOnDelay: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.init();
  }

  private async init() {
    this.refreshTriggers();
  }

  async refreshTriggers() {
    this.triggersWords = (await getTriggersWords()) || [];
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
    if (!triggerWord) return;

    const triggerMessage = await this.getTriggerIfCanSend(
      wordInMessage,
      triggerWord
    );

    return triggerMessage;
  }

  async getTriggerIfCanSend(wholeWord: string, triggerWord: string) {
    const foundedTrigger = await this.getTriggerByTriggerWord(triggerWord);
    if (!foundedTrigger) return false;
    const { name, mode } = foundedTrigger;
    switch (mode) {
      case "WHOLE-WORD":
        if (wholeWord !== triggerWord) {
          triggerLogger.info(
            `WHOLE-WORD: Trigger ${name} - trigger word (${triggerWord} != ${wholeWord}). Not sending`
          );
          return false;
        }
        break;
      case "STARTS-WITH":
        if (!wholeWord.startsWith(triggerWord)) {
          triggerLogger.info(
            `STARTS-WITH: Trigger ${name} not starting with word. Not sending`
          );
          return false;
        }
        break;
    }

    return await this.getTriggerIfNotOnDelay(foundedTrigger);
  }

  async getTriggerIfNotOnDelay(trigger: ITrigger) {
    const { _id, name, onDelay, delay, messages } = trigger;

    const triggerAvailable = await this.checkTriggerDelay(
      _id,
      name,
      delay,
      onDelay
    );

    if (!triggerAvailable) return;

    triggerLogger.info(`Use ${name} trigger, delay: ${delay}s`);
    return await this.getTriggerMessage(messages);
  }

  async getTriggerMessage(messages: string[]) {
    return messages[randomWithMax(messages.length)];
  }

  async getTriggerByTriggerWord(triggerWord: string) {
    const foundedTrigger = await getOneTrigger({
      words: { $regex: new RegExp(`\\b${triggerWord}\\b`, "i") },
    });
    return foundedTrigger;
  }

  async checkTriggerDelay(
    id: string,
    name: string,
    delay: number,
    onDelay: boolean
  ) {
    if (onDelay && this.triggersOnDelay.has(name)) {
      //if trigger on delay and is timeout set return false
      triggerLogger.info(`Trigger on delay, timeout set - do nothing`);
      return false;
    } else if (onDelay && !this.triggersOnDelay.has(name)) {
      // if on delay but timeout is not set - set timeout and return false
      triggerLogger.info(
        `Trigger: ${name} just on delay - set timeout(${Math.round(delay)}s)`
      );
      this.setTimeoutRefreshTriggerDelay(id, name, delay);
      return false;
    } else {
      // update trigger and return true
      this.updateTrigerAfterUsage(id);
      return true;
    }
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
        console.log(`${name} - is now turn on again!`);
        triggerLogger.info(`${name} - is now turn on again!`);
      }, delay * 1000)
    );
  }
}
export default TriggersHandler;

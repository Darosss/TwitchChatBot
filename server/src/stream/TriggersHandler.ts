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

  async checkMessageForTrigger(message: string) {
    const triggerWord = this.triggersWords.find((word) =>
      message.toLowerCase().includes(word)
    );

    if (!triggerWord) return;

    const triggerMessage = await this.getTriggerIfNotOnDelay(triggerWord);

    return triggerMessage;
  }

  async getTriggerIfNotOnDelay(triggerWord: string) {
    const foundedTrigger = await this.getTriggerByTriggerWord(triggerWord);
    if (!foundedTrigger) return;

    const { _id, name, onDelay, delay, messages } = foundedTrigger;

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
      words: { $regex: triggerWord, $options: "i" },
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
      triggerLogger.info(`Trigger just on delay - set timeout`);
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

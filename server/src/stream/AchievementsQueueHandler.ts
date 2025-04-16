import { QueueHandler } from "./QueueHandler";

export class AchievementsQueueHandler<T> extends QueueHandler<T> {
  private interval: NodeJS.Timeout | null = null;
  private timeout: NodeJS.Timeout | null = null;
  constructor() {
    super();
  }

  private clearInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  private clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  protected startInterval(cb: (item: T) => void) {
    if (this.interval) return;
    this.interval = setInterval(async () => {
      const item = this.peek();

      if (!item) return this.clearInterval();

      cb(item);

      if (item) this.dequeue();
    }, 2500);
  }

  protected startTimeout(delay = 1000, cb: (item: T) => void) {
    if (this.timeout) return;

    this.timeout = setTimeout(async () => {
      const item = this.peek();

      if (!item) return this.clearTimeout();

      this.clearTimeout();
      if (item) this.dequeue();
      cb(item);
    }, delay);
  }

  override enqueue(item: T, overrideAddInfo?: string) {
    super.enqueue(item);
    !overrideAddInfo
      ? console.log(`Item ${JSON.stringify(item)} inserted`)
      : console.log(`Item ${overrideAddInfo} inserted`);
  }
}

export default QueueHandler;

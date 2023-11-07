class QueueHandler<T> {
  private items: T[];
  private interval: NodeJS.Timeout | null = null;
  constructor() {
    this.items = [];
  }

  private clearInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
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

  public enqueue(item: T) {
    this.items.push(item);
    console.log(`Item ${JSON.stringify(item)} inserted`);
  }

  public dequeue() {
    if (this.isEmpty()) {
      return console.log("No items in queue");
    }
    return this.items.shift();
  }

  public peek() {
    if (this.isEmpty()) {
      return console.log("No items in queue");
    }
    return this.items[0];
  }

  public isEmpty() {
    return this.items.length == 0;
  }

  public getItemsCountInQueue() {
    return this.items.length;
  }

  public printQueue() {
    console.log(JSON.stringify(this.items));
  }
}

export default QueueHandler;

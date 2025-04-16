import { shuffleArray } from "@utils";

export class QueueHandler<T> {
  protected items: T[];

  constructor() {
    this.items = [];
  }

  public enqueue(item: T): void {
    this.items.push(item);
  }

  public dequeue(): T | undefined {
    return this.items.shift();
  }

  public peek(): T | undefined {
    return this.items[0];
  }

  public size(): number {
    return this.items.length;
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public clear(): void {
    this.items = [];
  }

  public getItems(): T[] {
    return this.items;
  }

  public getLength(): number {
    return this.items.length;
  }

  public shuffle() {
    this.items = shuffleArray(this.items);
  }
}

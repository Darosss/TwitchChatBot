import { ClientEvents } from "discord.js";

export interface EventData {
  name: keyof ClientEvents;
  once?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any) => Promise<void> | void;
}

export type EventsExportData = Record<string, EventData>;

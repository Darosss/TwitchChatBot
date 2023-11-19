import { Client, Events } from "discord.js";
import { EventData } from "./types";

export const ready: EventData = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
  }
};

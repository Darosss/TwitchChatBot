import { Client, GatewayIntentBits, Collection } from "discord.js";
import { discordClientToken } from "@configs";
import { registerUpdateSlashCommands } from "./deployCommands";
import { commands } from "./commands";
import { events } from "./events";

registerUpdateSlashCommands();

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(discordClientToken);

client.commands = new Collection();

for (const key of Object.keys(commands)) {
  const command = commands[key];
  client.commands.set(command.data.name, command);
}

for (const key of Object.keys(events)) {
  const event = events[key];
  event.once
    ? client.once(event.name, (...args) => event.execute(...args))
    : client.on(event.name, (...args) => event.execute(...args));
}

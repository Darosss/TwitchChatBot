import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { discordClientId, discordClientToken } from "@configs";
import { commands } from "./commands";
const rest = new REST().setToken(discordClientToken);

const commandsList: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandsKeys = Object.keys(commands);
for (const key of commandsKeys) {
  commandsList.push(commands[key].data.toJSON());
}

export const registerUpdateSlashCommands = async () => {
  try {
    console.log(`Started refreshing ${commandsKeys.length} application (/) commands.`);

    await rest.put(Routes.applicationCommands(discordClientId), {
      body: commandsList
    });

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
};

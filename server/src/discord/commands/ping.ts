import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandData } from "./types";

export const ping: CommandData = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
  execute: async (interaction: CommandInteraction) => interaction.reply("Pong!")
};

import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandData } from "./types";

export const ping: CommandData = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction: CommandInteraction) => interaction.reply("Pong!")
};

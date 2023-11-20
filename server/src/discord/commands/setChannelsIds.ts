import { ChannelType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandData, CommandNames } from "./types";
import { updateConfigs } from "@services";

export const setObtainedAchievementsChannelId: CommandData = {
  data: new SlashCommandBuilder()
    .setName(CommandNames.SetObtainedAchievementsChannel)
    .addChannelOption((option) =>
      option
        .addChannelTypes(ChannelType.GuildText)
        .setDescription("Choose channel for annoucments")
        .setName("channel")
        .setRequired(true)
    )
    .setDescription("Sets channel for announce obtained user achievements!"),

  execute: async (interaction: CommandInteraction) => {
    const channelInput = interaction.options.get("channel");

    if (!channelInput || !channelInput.value)
      return interaction.reply({ content: `Something went wrong. Try again later`, ephemeral: true });
    await interaction.reply({ content: `Setting channel for obtained achievements`, ephemeral: true });

    await updateConfigs({ "achievementsConfigs.obtainedAchievementsChannelId": String(channelInput.value) });

    await interaction.editReply(`Successfully set channel for obtained achievements to ${channelInput.channel?.name}`);
  }
};

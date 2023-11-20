import {
  ChannelType,
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  bold,
  codeBlock,
  italic
} from "discord.js";
import {
  CommandData,
  CommandNames,
  OnChannelMessagesLogicFn,
  OnInterractionOptionsLogicFn,
  SendAchievementsListMessagesFn,
  SendBadgesListMessagesFn
} from "./types";
import { generateRandomWord, getDateFromSecondsToYMDHMS } from "@utils";
import { clearChannelFromMessages, findTextBasedChannelById, sendMessageInChannelByChannel } from "../utils";
import { getAchievements, getBadges } from "@services";
import { BadgeModel, StageData } from "@models";
import { publicPath } from "@configs";

const randomWordToProceed = generateRandomWord();
const randomWordToProceedLength = randomWordToProceed.length;
export const achievementsDataUpdate: CommandData = {
  data: new SlashCommandBuilder()
    .setName(CommandNames.AchievementsDataUpdate)
    .addChannelOption((option) =>
      option
        .addChannelTypes(ChannelType.GuildText)
        .setDescription("Text channel for achievements list")
        .setName("achievements_list_channel")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .addChannelTypes(ChannelType.GuildText)
        .setDescription("Text channel for badges list")
        .setName("badges_list_channel")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("confirm_word")
        .setDescription(`Write ${randomWordToProceed} to proceed`)
        .setRequired(true)
        .setMinLength(randomWordToProceedLength)
        .setMaxLength(randomWordToProceedLength)
    )
    .addBooleanOption((option) =>
      option.setName("delete_messages").setDescription("WARNING: If yes - delete all messages in provided channels. ")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    .setDescription("Writes achievements list and badges list in provided channels."),
  execute: async (interaction: CommandInteraction) => {
    const options = await onInterractionOptionsLogic(interaction);
    if (!interaction.channel || !options) return; //TODO: add logger;

    await onChannelsMessagesLogic(interaction, options);
  }
};

const onInterractionOptionsLogic: OnInterractionOptionsLogicFn = async (interaction) => {
  const confirmWord = interaction.options.get("confirm_word")?.value;
  const achievementListChannelId = interaction.options.get("achievements_list_channel")?.value as string;
  const badgesListChannelId = interaction.options.get("badges_list_channel")?.value as string;
  const deleteMessagesOpt = interaction.options.get("delete_messages")?.value as boolean | undefined;

  if (confirmWord !== randomWordToProceed || !achievementListChannelId || !badgesListChannelId) {
    await interaction.reply({ content: "Wrong confirm_word", ephemeral: true });
    return;
  }
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
    content: "I'll clear my messages and send achievements and badges list in a while."
  });
  return { achievementListChannelId, badgesListChannelId, deleteMessagesOpt };
};

const onChannelsMessagesLogic: OnChannelMessagesLogicFn = async (interaction, options) => {
  const achievementListChannel = findTextBasedChannelById(interaction.client, options.achievementListChannelId);
  const badgesListChannel = findTextBasedChannelById(interaction.client, options.badgesListChannelId);

  if (!achievementListChannel) {
    console.log("Provided achievement list channel does not exist");
    return;
  }

  if (!badgesListChannel) {
    console.log("Provided badge list channel does not exist");
    return;
  }

  if (options.deleteMessagesOpt) {
    await clearChannelFromMessages(achievementListChannel);
    await clearChannelFromMessages(badgesListChannel);
  }
  await sendBadgesListMessages({
    channel: badgesListChannel,
    achievementsListChannelUrl: achievementListChannel.url
  });

  await sendAchievementsListMessages({
    channel: achievementListChannel,
    badgesChannelUrl: badgesListChannel.url
  });
  await interaction.editReply("Successfully addded achievement list");
};

const sendAchievementsListMessages: SendAchievementsListMessagesFn = async ({ channel, badgesChannelUrl }) => {
  const headMessageRef = await sendMessageInChannelByChannel(
    channel,
    `ACHIEVEMENTS LIST\n${italic(`Badges can be found: ${badgesChannelUrl}`)}\n${bold(
      "Use search option to find what you looking for :)"
    )}\n`
  );

  await headMessageRef.suppressEmbeds(true);

  const achievementListMsg = await getAchievementsListMessagesData();
  if (!achievementListMsg) return;
  for await (const { name, description, isTime, stageData } of achievementListMsg) {
    const preStageMsg = `----------------------------\n(Back to top): ${headMessageRef.url}\n
    `;

    const stageDataString = stageData
      .map((stage) => {
        const nameStr = `Name:'${stage.name}'`;
        const goalStr = `Goal: ${isTime ? `'${getDateFromSecondsToYMDHMS(stage.goal).trim()}'` : stage.goal}`;
        const badgeStr = `Badge Name: ${stage.badge.name}`;
        return nameStr + "  |  " + goalStr + " | " + badgeStr;
      })
      .join("\n");

    const messageToSend = `${preStageMsg || ""}\n${codeBlock(
      "js",
      `ACHIEVEMENT: '${name}'\n'${description}'`
    )}\n${codeBlock("js", stageDataString)}`;

    const createdMessage = await channel.send(`\n${messageToSend}`);
    if (!createdMessage) return;
  }
};

const sendBadgesListMessages: SendBadgesListMessagesFn = async ({ channel, achievementsListChannelUrl }) => {
  const headMessageRef = await sendMessageInChannelByChannel(
    channel,
    `BADGES LIST\n${italic(`Achievements can be found: ${achievementsListChannelUrl}`)}\n${bold(
      "Use search option to find what you looking for :)"
    )}\n`
  );
  await headMessageRef.suppressEmbeds(true);
  const badgesListMsg = await getBadgesListMessagesData();
  if (!badgesListMsg) return;

  for await (const { name, description, imageUrl } of badgesListMsg) {
    await channel.send({
      content: `${`----------------------------\n(Back to top): ${headMessageRef.url}\n`}${name}\n${description}`,
      files: [{ attachment: imageUrl }]
    });
  }
};

const getAchievementsListMessagesData = async () => {
  const foundAchievements = await getAchievements({}, {}, { stages: true, stagesBadge: true });

  if (!foundAchievements) return;
  const achievementListData = foundAchievements.map(({ name, description, isTime, stages: { stageData } }) => ({
    name,
    description,
    isTime,
    stageData: stageData as unknown as StageData<BadgeModel>[]
  }));

  return achievementListData;
};

const getBadgesListMessagesData = async () => {
  const foundBadges = await getBadges({}, {});

  if (!foundBadges) return;

  const badgesData = foundBadges.map(({ _id, name, description, imageUrl }) => {
    const absolutePathImage = `${publicPath}/${imageUrl}`;
    return { _id, name, description, imageUrl: absolutePathImage };
  });

  return badgesData;
};

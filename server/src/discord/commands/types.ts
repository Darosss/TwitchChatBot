import { CommandInteraction, InteractionResponse, SlashCommandBuilder, TextBasedChannel } from "discord.js";

export enum CommandNames {
  AchievementsDataUpdate = "update-achievements-data",
  SetObtainedAchievementsChannel = "set-achievements-channel-id"
}

export interface CommandData {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<InteractionResponse<boolean> | void>;
}

export type CommandsExportData = Record<string, CommandData>;

export interface SendAchievementsListMessagesParams {
  channel: TextBasedChannel;
  badgesChannelUrl: string;
}

export type SendAchievementsListMessagesFn = (params: SendAchievementsListMessagesParams) => Promise<void>;

export interface SendBadgesListMessagesParams {
  channel: TextBasedChannel;
  achievementsListChannelUrl: string;
}

export type SendBadgesListMessagesFn = (params: SendBadgesListMessagesParams) => Promise<void>;

interface OnInterractionOptionsLogicReturnData {
  achievementListChannelId: string;
  badgesListChannelId: string;
  deleteMessagesOpt?: boolean;
}

export type OnInterractionOptionsLogicFn = (
  interaction: CommandInteraction
) => Promise<OnInterractionOptionsLogicReturnData | undefined>;

export type OnChannelMessagesLogicFn = (
  interaction: CommandInteraction,
  options: OnInterractionOptionsLogicReturnData
) => Promise<void>;

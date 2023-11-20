import { Client, TextBasedChannel } from "discord.js";
import { MessageType } from "./types";

export const clearChannelFromMessages = async (channel: TextBasedChannel) => {
  //TODO: make it to clear whole messages with loop
  const last100MessagesInChannel = await channel.messages.fetch({ limit: 100 });
  for await (const [, message] of last100MessagesInChannel) {
    if (message.deletable) await message.delete();
  }
};

export const findTextBasedChannelById = (client: Client, channelId: string) => {
  const channel = client.channels.cache.get(channelId);

  if (channel?.isTextBased()) {
    return channel as TextBasedChannel;
  }
};

export const clearWholeChannelAndCreateMessage = async (channel: TextBasedChannel, message: MessageType) => {
  await clearChannelFromMessages(channel);
  return await channel.send(message);
};

export const sendMessageInChannelByChannelId = (client: Client, channelId: string, message: MessageType) => {
  const channel = findTextBasedChannelById(client, channelId);

  if (channel) return sendMessageInChannelByChannel(channel as TextBasedChannel, message);
};

export const sendMessageInChannelByChannel = (channel: TextBasedChannel, message: MessageType) => {
  return channel.send(message);
};

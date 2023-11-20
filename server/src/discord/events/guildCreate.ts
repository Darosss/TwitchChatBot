import { ChannelType, Client, Events, TextBasedChannel, inlineCode } from "discord.js";
import { EventData } from "./types";
import { discordClientId } from "@configs";
import { CommandNames } from "../commands";

export const guildCreate: EventData = {
  name: Events.GuildCreate,
  once: true,
  execute(client: Client) {
    client.channels.cache.find((channel) => {
      if (channel.type === ChannelType.GuildText) {
        const botMember = channel.members.get(discordClientId);
        if (!botMember) return;
        channel.permissionsFor(botMember);
        (channel as TextBasedChannel)?.send(getWelcomeMessage());
      }
    });
  }
};
//TODO: add installation proces descirption

const getWelcomeMessage = () => {
  return `Thank you for inviting me!\nIn order for me to work:\n
  * use ${inlineCode(
    CommandNames.AchievementsDataUpdate
  )} - to choose channels for update list of badges and achievements\n
  * use ${inlineCode(CommandNames.SetObtainedAchievementsChannel)} - to choose obtained achievement annoucement channel
  `;
};

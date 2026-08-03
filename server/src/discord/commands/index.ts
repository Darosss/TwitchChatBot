import { achievementsDataUpdate } from "./achievementsDataUpdate";
import { ping } from "./ping";
import { setObtainedAchievementsChannelId } from "./setChannelsIds";
import { CommandsExportData } from "./types";
import type { CommandData } from "./types";
import { CommandNames } from "./enums";
export { CommandNames };
export type { CommandData };

export const commands: CommandsExportData = {
  ping,
  achievementsDataUpdate,
  setObtainedAchievementsChannelId
};

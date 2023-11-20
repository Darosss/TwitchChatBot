import { achievementsDataUpdate } from "./achievementsDataUpdate";
import { ping } from "./ping";
import { setObtainedAchievementsChannelId } from "./setChannelsIds";
import { CommandsExportData } from "./types";
import { CommandData } from "./types";
import { CommandNames } from "./types";
export { CommandData, CommandNames };

export const commands: CommandsExportData = {
  ping,
  achievementsDataUpdate,
  setObtainedAchievementsChannelId
};

import { achievementsDataUpdate } from "./achievementsDataUpdate";
import { ping } from "./ping";
import { CommandsExportData } from "./types";
import { CommandData } from "./types";

export { CommandData };

export const commands: CommandsExportData = {
  ping,
  achievementsDataUpdate
};

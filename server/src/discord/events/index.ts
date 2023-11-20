import { guildCreate } from "./guildCreate";
import { interactionCreate } from "./interactionCreate";
import { ready } from "./ready";
import { EventsExportData } from "./types";

export const events: EventsExportData = {
  ready,
  interactionCreate,
  guildCreate
};

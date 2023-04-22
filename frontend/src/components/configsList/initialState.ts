import { TriggersConfigs } from "@services/ConfigService";
import { LoyaltyConfigs } from "@services/ConfigService";
import { CommandsConfigs } from "@services/ConfigService";
import { MusicConfigs } from "@services/ConfigService";
import { PointsConfigs } from "@services/ConfigService";
import { ChatGamesConfigs } from "@services/ConfigService";
import {
  ConfigUpdateData,
  HeadConfigs,
  TimersConfigs,
} from "@services/ConfigService";

export const headConfigsInitial: HeadConfigs = {
  permissionLevels: {
    broadcaster: 0,
    mod: 0,
    vip: 0,
    all: 0,
  },
  intervalCheckViewersPeek: 0,
  delayBetweenMessages: {
    min: 0,
    max: 0,
  },
};

export const commandsConfigsInitial: CommandsConfigs = {
  commandsPrefix: "",
};

export const timersConfigsInitial: TimersConfigs = {
  timersIntervalDelay: 0,
  nonFollowTimerPoints: 0,
  nonSubTimerPoints: 0,
  sufixChance: 0,
  prefixChance: 0,
};
export const chatGamesConfigsInitial: ChatGamesConfigs = {
  activeUserTimeDelay: 0,
  chatGamesIntervalDelay: 0,
  minActiveUsersThreshold: 0,
};
export const triggersConfigsInitial: TriggersConfigs = {
  randomMessageChance: 0,
  sufixChance: 0,
  prefixChance: 0,
};
export const pointsConfigsInitial: PointsConfigs = {
  pointsIncrement: {
    message: 0,
    watch: 0,
    watchMultipler: 0,
  },
};
export const loyaltyConfigsInitial: LoyaltyConfigs = {
  intervalCheckChatters: 0,
};
export const musicConfigsInitial: MusicConfigs = {
  songRequest: false,
  maxAutoQueSize: 0,
  maxSongRequestByUser: 0,
};

import { ConfigUpdateData, TriggersConfigs } from "@services";
import { LoyaltyConfigs } from "@services";
import { CommandsConfigs } from "@services";
import { MusicConfigs } from "@services";
import { PointsConfigs } from "@services";
import { ChatGamesConfigs } from "@services";
import { HeadConfigs, TimersConfigs } from "@services";

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
  suffixChance: 0,
  prefixChance: 0,
};
export const chatGamesConfigsInitial: ChatGamesConfigs = {
  activeUserTimeDelay: 0,
  chatGamesIntervalDelay: 0,
  minActiveUsersThreshold: 0,
};
export const triggersConfigsInitial: TriggersConfigs = {
  randomMessageChance: 0,
  suffixChance: 0,
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

export const configsInitialState: ConfigUpdateData = {
  commandsConfigs: commandsConfigsInitial,
  timersConfigs: timersConfigsInitial,
  triggersConfigs: triggersConfigsInitial,
  chatGamesConfigs: chatGamesConfigsInitial,
  pointsConfigs: pointsConfigsInitial,
  loyaltyConfigs: loyaltyConfigsInitial,
  musicConfigs: musicConfigsInitial,
  headConfigs: headConfigsInitial,
};

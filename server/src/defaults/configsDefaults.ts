import { ConfigDefaults } from "./types";

export const configDefaults: ConfigDefaults = {
  commandsConfigs: {
    commandsPrefix: "--",
  },
  timersConfigs: {
    timersIntervalDelay: 20,
    nonFollowTimerPoints: 10,
    nonSubTimerPoints: 10,
    prefixChance: 10,
    sufixChance: 30,
  },
  chatGamesConfigs: {
    activeUserTimeDelay: 150,
    chatGamesIntervalDelay: 20,
    minActiveUsersThreshold: 3,
  },
  triggersConfigs: {
    randomMessageChance: 10,
    prefixChance: 30,
    sufixChance: 70,
  },
  pointsConfigs: {
    pointsIncrement: {
      message: 1,
      watch: 10,
      watchMultipler: 2.0,
    },
  },
  loyaltyConfigs: {
    intervalCheckChatters: 300,
  },
  musicConfigs: {
    songRequest: false,
    maxAutoQueSize: 3,
    maxSongRequestByUser: 1,
  },
  headConfigs: {
    intervalCheckViewersPeek: 600,
    permissionLevels: {
      broadcaster: 10,
      mod: 8,
      vip: 4,
      all: 0,
    },
    delayBetweenMessages: {
      min: 1000,
      max: 2000,
    },
  },
};

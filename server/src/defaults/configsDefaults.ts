import { ConfigDefaults } from "./types";

export const configDefaults: ConfigDefaults = {
  commandsConfigs: {
    commandsPrefix: "--",
  },
  timersConfigs: {
    timersIntervalDelay: 20,
  },
  chatGamesConfigs: {
    activeUserTimeDelay: 150,
    chatGamesIntervalDelay: 20,
    minActiveUsersThreshold: 3,
  },
  triggersConfigs: {
    randomMessageChance: 10,
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
  headConfigs: {
    intervalCheckViewersPeek: 600,
    permissionLevels: {
      broadcaster: 10,
      mod: 8,
      vip: 4,
      all: 0,
    },
  },
};

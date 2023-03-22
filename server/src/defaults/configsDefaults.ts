import { ConfigDefaults } from "./types";

export const configDefaults: ConfigDefaults = {
  commandsPrefix: "--",
  timersIntervalDelay: 20,
  activeUserTimeDelay: 150,
  chatGamesIntervalDelay: 20,
  minActiveUsersThreshold: 3,
  intervalCheckChatters: 300,
  pointsIncrement: {
    message: 1,
    watch: 10,
    watchMultipler: 2.0,
  },
  randomMessageChance: 10,
  intervalCheckViewersPeek: 600,
  permissionLevels: {
    broadcaster: 10,
    mod: 8,
    vip: 4,
    all: 0,
  },
};

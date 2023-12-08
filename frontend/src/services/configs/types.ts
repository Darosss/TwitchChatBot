import { BaseModelProperties } from "../api";

export interface TimersConfigs {
  timersIntervalDelay: number;
  nonFollowTimerPoints: number;
  nonSubTimerPoints: number;
  suffixChance: number;
  prefixChance: number;
}

export interface CommandsConfigs {
  commandsPrefix: string;
}

export interface ChatGamesConfigs {
  activeUserTimeDelay: number;
  chatGamesIntervalDelay: number;
  minActiveUsersThreshold: number;
}

export interface TriggersConfigs {
  randomMessageChance: number;
  suffixChance: number;
  prefixChance: number;
}
export interface MusicConfigs {
  songRequest: boolean;
  maxAutoQueSize: number;
  maxSongRequestByUser: number;
}

export interface PointsConfigs {
  pointsIncrement: {
    message: number;
    watch: number;
    watchMultipler: number;
  };
}

export interface LoyaltyConfigs {
  intervalCheckChatters: number;
}

export interface HeadConfigs {
  permissionLevels: {
    broadcaster: number;
    mod: number;
    vip: number;
    all: number;
  };
  intervalCheckViewersPeek: number;
  delayBetweenMessages: {
    min: number;
    max: number;
  };
}

export interface Config extends BaseModelProperties {
  commandsConfigs: CommandsConfigs;
  timersConfigs: TimersConfigs;
  chatGamesConfigs: ChatGamesConfigs;
  triggersConfigs: TriggersConfigs;
  pointsConfigs: PointsConfigs;
  loyaltyConfigs: LoyaltyConfigs;
  musicConfigs: MusicConfigs;
  headConfigs: HeadConfigs;
}

export interface ConfigUpdateData
  extends Omit<Config, "_id" | "createdAt" | "updatedAt"> {}

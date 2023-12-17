import { BaseModel, PrefixSuffixChancesConfig } from "../types";
import { Document } from "mongoose";

export interface TimersConfigs extends PrefixSuffixChancesConfig {
  timersIntervalDelay: number;
  nonFollowTimerPoints: number;
  nonSubTimerPoints: number;
}

export interface CommandsConfigs {
  commandsPrefix: string;
}

export interface ChatGamesConfigs {
  activeUserTimeDelay: number;
  chatGamesIntervalDelay: number;
  minActiveUsersThreshold: number;
}

export interface TriggersConfigs extends PrefixSuffixChancesConfig {
  randomMessageChance: number;
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

export interface MusicConfigs {
  songRequest: boolean;
  maxAutoQueSize: number;
  maxSongRequestByUser: number;
}

export interface AchievementsConfigs {
  obtainedAchievementsChannelId: string;
}

export interface ConfigModel extends BaseModel {
  commandsConfigs: CommandsConfigs;
  timersConfigs: TimersConfigs;
  chatGamesConfigs: ChatGamesConfigs;
  triggersConfigs: TriggersConfigs;
  pointsConfigs: PointsConfigs;
  loyaltyConfigs: LoyaltyConfigs;
  musicConfigs: MusicConfigs;
  headConfigs: HeadConfigs;
  achievementsConfigs: AchievementsConfigs;
}

export type ConfigDocument = ConfigModel & Document;

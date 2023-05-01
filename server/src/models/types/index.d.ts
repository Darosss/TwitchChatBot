import { Document, Types } from "mongoose";

interface BaseModel {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel extends BaseModel {
  twitchId: string;
  username: string;
  privileges: number;
  points?: number;
  watchTime?: number;
  lastSeen?: Date;
  messageCount?: number;
  notes?: string[];
  twitchName?: string;
  twitchCreated?: Date;
  follower?: Date;
}

export type UserDocument = UserModel & Document;

export interface MessageModel {
  _id: string;
  message: string;
  date: Date;
  owner: string | UserModel;
  ownerUsername: string;
}

export type MessageDocument = MessageModel & Document;

export interface RedemptionModel {
  _id: string;
  rewardId: string;
  userId: string | UserModel;
  twitchId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: string;
  message?: string;
}

export type RedemptionDocument = RedemptionModel & Document;

export interface SessionEventModel extends BaseModel {
  user: string | UserModel;
  name: string;
}

export interface StreamSessionModel {
  _id: string;
  sessionStart: Date;
  sessionEnd: Date;
  sessionTitles: Map<string, string>;
  categories: Map<string, string>;
  tags: Map<string, string>;
  viewers: Map<string, number>;
  watchers: Map<string, number>;
  events: SessionEventModel[];
}

export type StreamSessionDocument = StreamSessionModel & Document;

export type TriggerMode = "WHOLE-WORD" | "STARTS-WITH" | "ALL";

export interface TriggerModel extends BaseModel {
  name: string;
  enabled: boolean;
  chance: number;
  delay: number;
  onDelay: boolean;
  uses: number;
  words: string[];
  messages: string[];
  mode: TriggerMode;
  mood: string | MoodModel;
  tag: string | TagModel;
}

export type TriggerDocument = TriggerModel & Document;

interface PrefixSuffixChancesConfig {
  suffixChance: number;
  prefixChance: number;
}

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

export interface ConfigModel extends BaseModel {
  commandsConfigs: CommandsConfigs;
  timersConfigs: TimersConfigs;
  chatGamesConfigs: ChatGamesConfigs;
  triggersConfigs: TriggersConfigs;
  pointsConfigs: PointsConfigs;
  loyaltyConfigs: LoyaltyConfigs;
  musicConfigs: MusicConfigs;
  headConfigs: HeadConfigs;
}

export type ConfigDocument = ConfigModel & Document;

export interface ChatCommandModel extends BaseModel {
  name: string;
  description?: string;
  enabled: boolean;
  aliases: string[];
  messages: string[];
  privilege: number;
  uses: number;
  mood: string | MoodModel;
  tag: string | TagModel;
}

export type ChatCommandDocument = ChatCommandModel & Document;

export interface AuthModel {
  _id: string;
  accessToken: string;
  ivAccessToken: Buffer;
  refreshToken: string;
  ivRefreshToken: Buffer;
  expiresIn: number;
  obtainmentTimestamp: number;
  scope: string[];
}

export type AuthDocument = AuthModel & Document;

export interface MessageCategoryModel extends BaseModel {
  name: string;
  enabled: boolean;
  messages: Array<[string, number]>;
  uses: number;
  mood: string | MoodModel;
  tag: string | TagModel;
}

export type MessageCategoryDocument = MessageCategoryModel & Document;

interface LayoutBreakpoint {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static: boolean;
}
export interface WidgetsModel extends BaseModel {
  name: string;
  layout: { [P: string]: LayoutBreakpoint[] };
  toolbox: { [P: string]: LayoutBreakpoint[] };
}

export type WidgetsDocument = WidgetsModel & Document;

export interface OverlayModel extends BaseModel {
  name: string;
  layout: { [P: string]: LayoutBreakpoint[] };
  toolbox: { [P: string]: LayoutBreakpoint[] };
}

export type OverlayDocument = OverlayModel & Document;

export interface TimerModel extends BaseModel {
  name: string;
  enabled: boolean;
  delay: number;
  points: number;
  reqPoints: number;
  nonFollowMulti: boolean;
  nonSubMulti: boolean;
  uses: number;
  messages: string[];
  description: string;
  mood: string | MoodModel;
  tag: string | TagModel;
}

export type TimerDocument = TimerModel & Document;

export interface MoodModel extends BaseModel {
  name: string;
  enabled: boolean;
}

export type MoodDocument = MoodModel & Document;

export interface AffixModel extends BaseModel, PrefixSuffixChancesConfig {
  name: string;
  enabled: boolean;
  prefixes: string[];
  suffixes: string[];
  prefixChance: number;
  suffixChance: number;
}

export type AffixDocument = AffixModel & Document;

export interface TagModel extends BaseModel {
  name: string;
  enabled: boolean;
}

export type TagDocument = TagModel & Document;

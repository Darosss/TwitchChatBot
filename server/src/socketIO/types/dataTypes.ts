//TODO: I do not use tsconfig @paths here for one reason. These types right now are imported in /frontend @SocketTypes path
// When using /server paths it does not know the proper path. So use ../../ paths instead for now.
import { DownloadedData } from "../../models/songs";
import { AchievementModel, StageDataWithBadgePopulated, UserModel } from "../../models";
import { UpdateAchievementUserProgressProgressesArgs } from "../../services";
import { CommonUserstate, DeleteUserstate } from "tmi.js";

export type SongType = "yt" | "local";

export interface SongProperties {
  id: string;
  name: string;
  duration: number;
  type: SongType;
  downloadedData?: DownloadedData;
}

export interface AudioStreamData {
  downloadedData?: SongProperties["downloadedData"];
  id: string;
  name: string;
  duration: number;
  currentTime: number;
  requester?: string;
  volume: number;
  type: SongType;
}

export type AudioStreamDataEmitCb = {
  audioData: AudioStreamData;
  isPlaying: boolean;
} & AudioStreamDataSongsInQue;

export interface AudioStreamDataSongsInQue {
  songsInQue: [string, string][];
}

export interface RequestSongData {
  username: string;
  songName: string;
}

export interface EventAndUser {
  eventDate: Date;
  eventName: string;
  user: UserModel;
}

export interface AudioChunkData {
  chunk: string | Buffer;
}

export type MessageServerDataBadgesPathsType = [string, string, string];

export interface AddAchievementProgressToUserData extends UpdateAchievementUserProgressProgressesArgs {
  username: string;
}

export interface MessageServerDataMessageDataType {
  id: string;
  message: string;
  emotes: CommonUserstate["emotes"];
  timestamp: number;
}
export interface MessageServerData {
  user: Pick<UserModel, "_id" | "username"> & { badgesPaths: MessageServerDataBadgesPathsType };
  messageData: MessageServerDataMessageDataType;
}
export interface MessageServerDeleteData {
  username: string;
  userstate: DeleteUserstate;
  deletedMessage: string;
}

export interface CustomRewardCreateData {
  autoFulfill?: boolean;
  backgroundColor?: string;
  cost: number;
  globalCooldown?: number | null;
  isEnabled?: boolean;
  maxRedemptionsPerStream?: number | null;
  maxRedemptionsPerUserPerStream?: number | null;
  prompt?: string;
  title: string;
  userInputRequired?: boolean;
}

export interface CustomRewardData {
  autoFulfill: boolean;
  // backgroundColor: string;
  // broadcasterDisplayName: string;
  broadcasterId: string;
  // broadcasterName: string;
  // cooldownExpiryDate: Date | null;
  cost: number;
  // globalCooldown: number | null;
  id: string;
  isEnabled: boolean;
  isInStock: boolean;
  // isPaused: boolean;
  maxRedemptionsPerStream: number | null;
  maxRedemptionsPerUserPerStream: number | null;
  // prompt: string;
  // redemptionsThisStream: number | null;
  title: string;
  // userInputRequired: boolean;
}

export interface EventAndUser {
  eventDate: Date;
  eventName: string;
  user: UserModel;
}
export interface RewardData {
  rewardId: string;
  userId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: string;
}

export type ObtainAchievementDataStageType = {
  data: StageDataWithBadgePopulated;
  timestamp: number;
};

export type ObtainAchievementDataProgressDataType = {
  currentStage?: StageDataWithBadgePopulated;
  nextStage?: StageDataWithBadgePopulated;
  progress: number;
  timestamp: number;
};

export interface ObtainAchievementBaseData {
  id: string;
  achievement: Pick<AchievementModel, "name" | "isTime">;
  username: string;
}
export interface ObtainAchievementDataWithCollectedAchievement extends ObtainAchievementBaseData {
  stage: ObtainAchievementDataStageType;
}

export interface ObtainAchievementDataWithProgressOnly extends ObtainAchievementBaseData {
  progressData: ObtainAchievementDataProgressDataType;
}

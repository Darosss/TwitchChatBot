import { UserModel } from "@models/types";

export interface AudioYTData {
  id: string;
  name: string;
  duration: number;
  currentTime: number;
  requester?: string;
}

export interface AudioStreamData extends AudioYTData {
  audioBuffer: Buffer;
}

export interface AudioYTDataInfo {
  name: string;
  duration: number;
  currentTime: number;
  songsInQue: [string, string][];
  isPlaying: boolean;
}

export interface AudioStreamDataInfo extends AudioYTDataInfo {
  currentFolder: string;
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

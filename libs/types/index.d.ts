import { UserModel } from "../../server/src/models/types";

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

export type AudioPlayerOptions =
  | "play"
  | "stop"
  | "resume"
  | "pause"
  | "skip"
  | "sr"
  | "when"
  | "previous"
  | "next"
  | "load"
  | "volume";

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

export interface ServerToClientEvents extends ServerToClientYoutubeEvents {
  noArg: () => void;
  withAck: (callback: (e: number) => void) => void;
  messageServer: (date: Date, username: string, message: string) => void;
  userJoinTwitchChat: (eventAndUser: EventAndUser) => void;
  onRedemption: (data: RewardData, alertSound: Buffer) => void;
  audio: (data: AudioStreamData) => void;
  audioStop: () => void;
  getAudioInfo: (data: AudioStreamDataInfo) => void;
  getAudioYTInfo: (data: AudioYTDataInfo) => void;
  changeVolume: (volume: number) => void;
  forceReconnect: () => void;
  getCustomRewards: (data: CustomRewardData[]) => void;
  sendLoggedUserInfo: (username: string) => void;
}

export interface ServerToClientYoutubeEvents {
  changeYTVolume: (volume: number) => void;
  musicYTNext: () => void;
  musicYTPause: () => void;
  musicYTStop: () => void;
  musicYTPlay: () => void;
  audioYT: (data: AudioYTData) => void;
}

export interface ClientToServerEvents extends ClientToServerYoutubeEvents {
  messageClient: (message: string) => void;
  saveConfigs: () => void;
  refreshTriggers: () => void;
  refreshCommands: () => void;
  refreshTimers: () => void;
  changeModes: () => void;
  musicPause: () => void;
  musicStop: () => void;
  musicPlay: () => void;
  musicNext: () => void;
  changeVolume: (volume: number) => void;
  getAudioInfo: () => void;
  getAudioStreamData: () => void;
  loadSongs: (folderName: string) => void;
  createCustomReward: (
    data: CustomRewardCreateData,
    cb: (success: boolean) => void
  ) => void;
  deleteCustomReward: (id: string, cb: (success: boolean) => void) => void;
  updateCustomReward: (
    id: string,
    data: CustomRewardCreateData,
    cb: (success: boolean) => void
  ) => void;
  getCustomRewards: () => void;
  logout: () => void;
}

export interface ClientToServerYoutubeEvents {
  changeYTVolume: (volume: number) => void;
  musicYTNext: () => void;
  musicYTPause: () => void;
  musicYTStop: () => void;
  musicYTPlay: () => void;
  loadYTPlaylist: (playlistId: string) => void;
  getAudioYTData: (cb: (data: AudioYTData) => void) => void;
  getAudioYTInfo: (cb: (data: AudioYTDataInfo) => void) => void;
}

export interface InterServerEvents {
  ping: () => void;
  musicOnChatCommand: (option: AudioPlayerOptions) => void;
}

export interface SocketData {}

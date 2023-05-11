import { UserModel } from "@models/types";
import { Server } from "socket.io";
export type ServerSocket = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

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

export interface ServerToClientEvents
  extends ServerToClientYoutubeEvents,
    ServerToClientMusicLocalEvents {
  noArg: () => void;
  withAck: (callback: (e: number) => void) => void;
  messageServer: (date: Date, username: string, message: string) => void;
  userJoinTwitchChat: (eventAndUser: EventAndUser) => void;
  onRedemption: (data: RewardData, alertSound: Buffer) => void;

  forceReconnect: () => void;
  getCustomRewards: (data: CustomRewardData[]) => void;
  sendLoggedUserInfo: (username: string) => void;
}

export interface ServerToClientMusicLocalEvents {
  audio: (data: AudioStreamData) => void;
  audioStop: () => void;
  getAudioInfo: (data: AudioStreamDataInfo) => void;
  changeVolume: (volume: number) => void;
}

export interface ServerToClientYoutubeEvents {
  changeYTVolume: (volume: number) => void;
  musicYTNext: () => void;
  musicYTPause: () => void;
  musicYTStop: () => void;
  musicYTPlay: () => void;
  audioYT: (data: AudioYTData) => void;
  getAudioYTInfo: (data: AudioYTDataInfo) => void;
}

export interface ClientToServerEvents
  extends ClientToServerMusicLocalEvents,
    ClientToServerYoutubeEvents,
    ClientToServerCustomRewards {
  messageClient: (message: string) => void;
  saveConfigs: () => void;
  refreshTriggers: () => void;
  refreshCommands: () => void;
  refreshTimers: () => void;
  changeModes: () => void;
  logout: () => void;
}

export interface ClientToServerCustomRewards {
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
}

export interface ClientToServerMusicLocalEvents {
  musicPause: () => void;
  musicStop: () => void;
  musicPlay: () => void;
  musicNext: () => void;
  changeVolume: (volume: number) => void;
  getAudioStreamData: () => void;
  loadSongs: (folderName: string) => void;
  getAudioInfo: (cb: (data: AudioStreamDataInfo) => void) => void;
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
}

export interface SocketData {}

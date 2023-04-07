import { UserModel } from "../../server/src/models/types";

export interface Event {
  eventDate: Date;
  eventName: string;
}

export interface AudioStreamData {
  audioBuffer: Buffer;
  name: string;
  duration: number;
  currentTime: number;
  requester?: string;
}

export interface AudioStreamDataInfo {
  name: string;
  duration: number;
  songsInQue: string[];
}

export type AudioPlayerOptions =
  | "play"
  | "stop"
  | "resume"
  | "pause"
  | "next"
  | "sr";

export interface EventAndIUser extends Event, UserModel {}
export interface ServerToClientEvents {
  noArg: () => void;
  withAck: (callback: (e: number) => void) => void;
  messageServer: (date: Date, username: string, message: string) => void;
  userJoinTwitchChat: (eventDate: Event, user: UserModel) => void;
  onRedemption: (data: SoundData) => void;
  audio: (data: AudioStreamData) => void;
  audioStop: () => void;
  getAudioInfo: (data: AudioStreamDataInfo) => void;
  forceReconnect: () => void;
}

export interface ClientToServerEvents {
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
  getAudioInfo: () => void;
  getAudioStreamData: () => void;
}

export interface InterServerEvents {
  ping: () => void;
  musicOnChatCommand: (option: AudioPlayerOptions) => void;
}

export interface SoundData {
  rewardId: string;
  userId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: string;
}

export interface SocketData {}

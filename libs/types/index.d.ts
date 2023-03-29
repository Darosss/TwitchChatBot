import { UserModel } from "../../server/src/models/types";

export interface Event {
  eventDate: Date;
  eventName: string;
}

export interface EventAndIUser extends Event, UserModel {}
export interface ServerToClientEvents {
  noArg: () => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  messageServer: (date: Date, username: string, message: string) => void;
  userJoinTwitchChat: (eventDate: Event, user: UserModel) => void;
  onRedemption: (data: SoundData) => void;
}

export interface ClientToServerEvents {
  messageClient: (message: string) => void;
  saveConfigs: () => void;
  refreshTriggers: () => void;
  refreshCommands: () => void;
  refreshTimers: () => void;
  changeModes: () => void;
}

export interface InterServerEvents {
  ping: () => void;
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

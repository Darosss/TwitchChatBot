import { IUser } from "../../server/src/models/types";

export interface IEvent {
  eventDate: Date;
  eventName: string;
}

export interface IEventAndIUser extends IEvent, IUser {}
export interface ServerToClientEvents {
  noArg: () => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  messageServer: (date: Date, username: string, message: string) => void;
  userJoinTwitchChat: (eventDate: IEvent, user: IUser) => void;
  onRedemption: (data: ISoundData) => void;
}

export interface ClientToServerEvents {
  messageClient: (message: string) => void;
  saveConfigs: () => void;
  refreshTriggers: () => void;
  refreshCommands: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface ISoundData {
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

import { IUser } from "../../server/src/models/types";

interface IEvent {
  eventDate: Date;
  eventName: string;
}

interface IEventAndIUser extends IEvent, IUser {}
interface ServerToClientEvents {
  noArg: () => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  messageServer: (date: Date, username: string, message: string) => void;
  userJoinTwitchChat: (eventDate: IEvent, user: IUser) => void;
  onRedemption: (data: ISoundData) => void;
}

interface ClientToServerEvents {
  messageClient: (date: Date, username: string, message: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface ISoundData {
  rewardId: string;
  userId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: string;
}

interface SocketData {
  name: string;
  age: number;
}

export {
  ClientToServerEvents,
  SocketData,
  InterServerEvents,
  ServerToClientEvents,
  IEventAndIUser,
};

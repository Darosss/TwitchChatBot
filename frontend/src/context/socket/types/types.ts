import { ClientToServerEvents, ServerToClientEvents } from ".";

export interface SocketContexType {
  emits?: ClientToServerEvents;
  events?: SocketContextEvents;
}

export interface SocketContextOffEvents {
  sendLoggedUserInfo: () => void;
}

type SocketContextEvents = {
  [K in keyof ServerToClientEvents]: EventHandler<ServerToClientEvents[K]>;
};

type EventHandler<T> = {
  on: (cb: T) => void;
  off: () => void;
};

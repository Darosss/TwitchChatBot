import { Server } from "socket.io";
import { ClientToServerEvents } from "./clientToServer";
import { ServerToClientEvents } from "./serverToClient";

export { ClientToServerEvents } from "./clientToServer";
export { ServerToClientEvents } from "./serverToClient";
export * from "./dataTypes";

export type ServerSocket = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {}

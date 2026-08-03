import { Server } from "socket.io";
import { ClientToServerEvents } from "./clientToServer";
import { ServerToClientEvents } from "./serverToClient";

export type { ClientToServerEvents } from "./clientToServer";
export type { ServerToClientEvents } from "./serverToClient";
export * from "./dataTypes";

export type ServerSocket = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export interface InterServerEvents {
  ping: () => void;
}

// disable for now, maybe used later
export interface SocketData {}

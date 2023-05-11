import React from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@libs/types";
import { viteBackendUrl } from "src/configs/envVariables";

export const socketConn = io(viteBackendUrl) as Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

export const SocketContext = React.createContext<
  Socket<ServerToClientEvents, ClientToServerEvents>
>({} as Socket<ServerToClientEvents, ClientToServerEvents>);

socketConn.on("forceReconnect", () => {
  socketConn.disconnect();

  socketConn.connect();
});

export const socketEmitRefreshTriggers = () => {
  socketConn.emit("refreshTriggers");
};

export const socketEmitRefreshTimers = () => {
  socketConn.emit("refreshTimers");
};

export const socketEmitRefreshCommands = () => {
  socketConn.emit("refreshCommands");
};

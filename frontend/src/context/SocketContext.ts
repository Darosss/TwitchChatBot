import React from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@libs/types";

export const socketConn = io(
  import.meta.env.VITE_SOCKET_URL as string
) as Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = React.createContext<
  Socket<ServerToClientEvents, ClientToServerEvents>
>({} as Socket<ServerToClientEvents, ClientToServerEvents>);

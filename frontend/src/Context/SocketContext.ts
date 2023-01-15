import React from "react";
import { io, Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../../libs/types";

export const socketConn = io(
  process.env.REACT_APP_SOCKET_URL as string
) as Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = React.createContext<
  Socket<ServerToClientEvents, ClientToServerEvents>
>({} as Socket<ServerToClientEvents, ClientToServerEvents>);

import React from "react";
import { io, Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../../libs/types";

export const socketConn = io(`http://localhost:5000`) as Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

export const SocketContext = React.createContext<
  Socket<ServerToClientEvents, ClientToServerEvents>
>({} as Socket<ServerToClientEvents, ClientToServerEvents>);

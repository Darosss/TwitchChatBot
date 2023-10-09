import React, { useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketContexType,
} from "./types";
import { viteBackendUrl } from "src/configs/envVariables";
import { getSocketEmitsFunctions } from "./emits";
import { getSocketEventsFunctions } from "./events";

export const SocketContext = React.createContext<SocketContexType | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const socketConn = io(viteBackendUrl) as Socket<
    ServerToClientEvents,
    ClientToServerEvents
  >;
  const emits = useMemo<SocketContexType["emits"]>(() => {
    if (!socketConn) return;

    return getSocketEmitsFunctions(socketConn);
  }, [socketConn]);

  const events = useMemo<SocketContexType["events"]>(() => {
    if (!socketConn) return;

    return getSocketEventsFunctions(socketConn);
  }, [socketConn]);

  useEffect(() => {
    if (!socketConn || !events) return;

    events.forceReconnect.on(() => {
      socketConn.disconnect();

      socketConn.connect();
    });

    return () => {
      events.forceReconnect.off();
    };
  }, [socketConn, events]);

  return (
    <SocketContext.Provider value={{ emits, events }}>
      {children}
    </SocketContext.Provider>
  );
};

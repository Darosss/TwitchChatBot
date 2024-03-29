import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
  ServerSocket,
  ServerToClientEvents,
  SocketData
} from "./types";
import http from "http";

let SOCKET_IO: ServerSocket | null = null;

export const newSocket = (httpServer: http.Server) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  io.on("connection", async (socket) => {
    console.log(socket.id, "connected");

    socket.on("refreshOverlayLayout", (id) => io.emit("refreshOverlayLayout", id));
  });

  SOCKET_IO = io;
  return SOCKET_IO;
};

export const getSocketInstance = () => SOCKET_IO;

//TODO: duplicate function is in frontend utils
export const isObtainedAchievement = (
  data: ObtainAchievementDataWithCollectedAchievement | ObtainAchievementDataWithProgressOnly
): data is ObtainAchievementDataWithCollectedAchievement => {
  return (
    (data as ObtainAchievementDataWithCollectedAchievement).stage !== undefined &&
    (data as ObtainAchievementDataWithCollectedAchievement).stage !== null
  );
};

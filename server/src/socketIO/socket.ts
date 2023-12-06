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

const localSocket = (httpServer: http.Server) => {
  const io: ServerSocket = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
    {
      cors: { origin: "*", methods: ["GET", "POST"] }
    }
  );

  io.on("connection", async (socket) => {
    console.log(socket.id, "connected");

    socket.on("refreshOverlayLayout", (id) => io.emit("refreshOverlayLayout", id));
  });

  return io;
};

//TODO: duplicate function is in frontend utils
export const isObtainedAchievement = (
  data: ObtainAchievementDataWithCollectedAchievement | ObtainAchievementDataWithProgressOnly
): data is ObtainAchievementDataWithCollectedAchievement => {
  return (
    (data as ObtainAchievementDataWithCollectedAchievement).stage !== undefined &&
    (data as ObtainAchievementDataWithCollectedAchievement).stage !== null
  );
};

export default localSocket;

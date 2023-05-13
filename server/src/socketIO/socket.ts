import { Server } from "socket.io";
import { ClientToServerEvents, InterServerEvents, ServerSocket, ServerToClientEvents, SocketData } from "./types";
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
  });

  return io;
};

export default localSocket;

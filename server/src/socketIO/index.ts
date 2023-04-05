import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";

import path from "node:path";
import MusicStreamHandler from "./MusicStreamHandler";

const localSocket = (httpServer: any) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  const musicPath = path.resolve(__dirname, "../data/music");

  const musicStreamHandler = new MusicStreamHandler(io, musicPath);
  musicStreamHandler.init();

  io.on("connection", async (socket) => {
    musicStreamHandler.addJoinedClientAsListener(socket.id);

    socket.on("musicPause", () => {
      musicStreamHandler.pausePlayer();
    });
    socket.on("musicStop", () => {});
    socket.on("musicPlay", () => {
      musicStreamHandler.resumePlayer();
    });

    socket.on("musicNext", () => {
      musicStreamHandler.nextSong();
    });

    socket.on("getAudioInfo", () => {
      const audioInfo = musicStreamHandler.getAudioInfo();
      if (!audioInfo) return;

      io.to(socket.id).emit("getAudioInfo", audioInfo);
    });
  });

  return io;
};

export default localSocket;

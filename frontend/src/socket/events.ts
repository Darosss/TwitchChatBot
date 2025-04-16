import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketContexType,
} from "./types";

export const getSocketEventsFunctions = (
  socketConnection: Socket<ServerToClientEvents, ClientToServerEvents>
): SocketContexType["events"] => {
  return {
    sendLoggedUserInfo: {
      on: (cb) => {
        socketConnection.on("sendLoggedUserInfo", (username) => cb(username));
      },
      off: () => {
        socketConnection.off("sendLoggedUserInfo");
      },
    },
    messageServer: {
      on: (cb) => {
        socketConnection.on("messageServer", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("messageServer");
      },
    },
    messageServerDelete: {
      on: (cb) => {
        socketConnection.on("messageServerDelete", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("messageServerDelete");
      },
    },
    userJoinTwitchChat: {
      on: (cb) => {
        socketConnection.on("userJoinTwitchChat", (eventAndUser) =>
          cb(eventAndUser)
        );
      },
      off: () => {
        socketConnection.off("userJoinTwitchChat");
      },
    },
    onRedemption: {
      on: (cb) => {
        socketConnection.on("onRedemption", (data, alertSound) =>
          cb(data, alertSound)
        );
      },
      off: () => {
        socketConnection.off("onRedemption");
      },
    },
    forceReconnect: {
      on: (cb) => {
        socketConnection.on("forceReconnect", () => cb());
      },
      off: () => {
        socketConnection.off("forceReconnect");
      },
    },
    getCustomRewards: {
      on: (cb) => {
        socketConnection.on("getCustomRewards", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("getCustomRewards");
      },
    },
    obtainAchievement: {
      on: (cb) => {
        socketConnection.on("obtainAchievement", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("obtainAchievement");
      },
    },
    obtainAchievementQueueInfo: {
      on: (cb) => {
        socketConnection.on("obtainAchievementQueueInfo", (count) => cb(count));
      },
      off: () => {
        socketConnection.off("obtainAchievementQueueInfo");
      },
    },
    refreshOverlayLayout: {
      on: (cb) => {
        socketConnection.on("refreshOverlayLayout", (overlayId) =>
          cb(overlayId)
        );
      },
      off: () => {
        socketConnection.off("refreshOverlayLayout");
      },
    },
    changeVolume: {
      on: (cb) => {
        socketConnection.on("changeVolume", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("changeVolume");
      },
    },
    musicNext: {
      on: (cb) => {
        socketConnection.on("musicNext", () => cb());
      },
      off: () => {
        socketConnection.off("musicNext");
      },
    },
    musicPause: {
      on: (cb) => {
        socketConnection.on("musicPause", (isPlaying) => cb(isPlaying));
      },
      off: () => {
        socketConnection.off("musicPause");
      },
    },
    musicStop: {
      on: (cb) => {
        socketConnection.on("musicStop", () => cb());
      },
      off: () => {
        socketConnection.off("musicStop");
      },
    },
    musicPlay: {
      on: (cb) => {
        socketConnection.on("musicPlay", () => cb());
      },
      off: () => {
        socketConnection.off("musicPlay");
      },
    },
    audioStreamData: {
      on: (cb) => {
        socketConnection.on("audioStreamData", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("audioStreamData");
      },
    },
    audioChunk: {
      on: (cb) => {
        socketConnection.on("audioChunk", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("audioChunk");
      },
    },
    requestSong: {
      on: (cb) => {
        socketConnection.on("requestSong", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("requestSong");
      },
    },
  };
};

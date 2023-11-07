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
    noArg: {
      on: (cb) => {
        socketConnection.on("noArg", () => cb());
      },
      off: () => {
        socketConnection.off("noArg");
      },
    },
    withAck: {
      on: (cb) => {
        socketConnection.on("withAck", (e) => cb(e));
      },
      off: () => {
        socketConnection.off("withAck");
      },
    },
    messageServer: {
      on: (cb) => {
        socketConnection.on("messageServer", (date, username, message) =>
          cb(date, username, message)
        );
      },
      off: () => {
        socketConnection.off("messageServer");
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
    changeYTVolume: {
      on: (cb) => {
        socketConnection.on("changeYTVolume", (volume) => cb(volume));
      },
      off: () => {
        socketConnection.off("changeYTVolume");
      },
    },
    musicYTNext: {
      on: (cb) => {
        socketConnection.on("musicYTNext", () => cb());
      },
      off: () => {
        socketConnection.off("musicYTNext");
      },
    },
    musicYTPause: {
      on: (cb) => {
        socketConnection.on("musicYTPause", () => cb());
      },
      off: () => {
        socketConnection.off("musicYTPause");
      },
    },
    musicYTStop: {
      on: (cb) => {
        socketConnection.on("musicYTStop", () => cb());
      },
      off: () => {
        socketConnection.off("musicYTStop");
      },
    },
    musicYTPlay: {
      on: (cb) => {
        socketConnection.on("musicYTPlay", () => cb());
      },
      off: () => {
        socketConnection.off("musicYTPlay");
      },
    },
    audioYT: {
      on: (cb) => {
        socketConnection.on("audioYT", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("audioYT");
      },
    },
    getAudioYTInfo: {
      on: (cb) => {
        socketConnection.on("getAudioYTInfo", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("getAudioYTInfo");
      },
    },
    audio: {
      on: (cb) => {
        socketConnection.on("audio", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("audio");
      },
    },
    audioStop: {
      on: (cb) => {
        socketConnection.on("audioStop", () => cb());
      },
      off: () => {
        socketConnection.off("audioStop");
      },
    },
    getAudioInfo: {
      on: (cb) => {
        socketConnection.on("getAudioInfo", (data) => cb(data));
      },
      off: () => {
        socketConnection.off("getAudioInfo");
      },
    },
    changeVolume: {
      on: (cb) => {
        socketConnection.on("changeVolume", (volume) => cb(volume));
      },
      off: () => {
        socketConnection.off("changeVolume");
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
  };
};

import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ObtainAchievementDataWithCollectedAchievement,
  ServerToClientEvents,
  SocketContexType,
} from "./types";

export const getSocketEmitsFunctions = (
  socketConnection: Socket<ServerToClientEvents, ClientToServerEvents>
): SocketContexType["emits"] => {
  return {
    refreshTriggers: () => {
      socketConnection.emit("refreshTriggers");
    },
    refreshTimers: () => {
      socketConnection.emit("refreshTimers");
    },
    refreshCommands: () => {
      socketConnection.emit("refreshCommands");
    },
    logout: () => {
      socketConnection.emit("logout");
    },
    messageClient: (message: string) => {
      socketConnection.emit("messageClient", message);
    },
    saveConfigs: () => {
      socketConnection.emit("saveConfigs");
    },
    changeModes: () => {
      socketConnection.emit("changeModes");
    },
    changeVolume: (volume) => {
      socketConnection.emit("changeVolume", volume);
    },
    musicPause: () => {
      socketConnection.emit("musicPause");
    },
    musicStop: () => {
      socketConnection.emit("musicStop");
    },
    musicNext: () => {
      socketConnection.emit("musicNext");
    },
    musicPlay: () => {
      socketConnection.emit("musicPlay");
    },
    loadSongs: (folderName) => {
      socketConnection.emit("loadSongs", folderName);
    },
    getAudioInfo: (cb) => {
      socketConnection.emit("getAudioInfo", cb);
    },
    getAudioStreamData: (cb) => {
      socketConnection.emit("getAudioStreamData", cb);
    },
    changeYTVolume: (volume) => {
      socketConnection.emit("changeYTVolume", volume);
    },
    musicYTNext: () => {
      socketConnection.emit("musicYTNext");
    },
    musicYTPause: () => {
      socketConnection.emit("musicYTPause");
    },
    musicYTStop: () => {
      socketConnection.emit("musicYTStop");
    },
    musicYTPlay: () => {
      socketConnection.emit("musicYTPlay");
    },
    loadYTPlaylist: (playlistId) => {
      socketConnection.emit("loadYTPlaylist", playlistId);
    },
    getAudioYTData: (cb) => {
      socketConnection.emit("getAudioYTData", cb);
    },
    getAudioYTInfo: (cb) => {
      socketConnection.emit("getAudioYTInfo", cb);
    },
    createCustomReward: (data, cb) => {
      socketConnection.emit("createCustomReward", data, cb);
    },
    deleteCustomReward: (id, cb) => {
      socketConnection.emit("deleteCustomReward", id, cb);
    },
    updateCustomReward: (id, data, cb) => {
      socketConnection.emit("updateCustomReward", id, data, cb);
    },
    getCustomRewards: () => {
      socketConnection.emit("getCustomRewards");
    },
    emulateAchievement: (
      data: ObtainAchievementDataWithCollectedAchievement
    ) => {
      socketConnection.emit("emulateAchievement", data);
    },

    refreshOverlayLayout: (overlayId: string) => {
      socketConnection.emit("refreshOverlayLayout", overlayId);
    },
    addAchievementProgressToUser: (data, cb) => {
      socketConnection.emit("addAchievementProgressToUser", data, cb);
    },
  };
};

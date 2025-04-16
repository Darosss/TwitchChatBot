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
    loadPlaylist: (data) => {
      socketConnection.emit("loadPlaylist", data);
    },
    addSongToPlayer: (data) => {
      socketConnection.emit("addSongToPlayer", data);
    },
    sendBufferedInfo: (data) => {
      socketConnection.emit("sendBufferedInfo", data);
    },
    loadFolder: (folderName) => {
      socketConnection.emit("loadFolder", folderName);
    },
    getAudioData: (cb) => {
      socketConnection.emit("getAudioData", cb);
    },
    changeVolume: (volume) => {
      socketConnection.emit("changeVolume", volume);
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

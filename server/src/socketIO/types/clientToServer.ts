import {
  CustomRewardCreateData,
  ObtainAchievementDataWithCollectedAchievement,
  AddAchievementProgressToUserData,
  AudioStreamDataEmitCb
} from "./dataTypes";

export interface ClientToServerEvents extends ClientToServerMusicEvents, ClientToServerCustomRewards {
  messageClient: (message: string) => void;
  saveConfigs: () => void;
  refreshTriggers: () => void;
  refreshCommands: () => void;
  refreshTimers: () => void;
  changeModes: () => void;
  logout: () => void;
  emulateAchievement: (data: ObtainAchievementDataWithCollectedAchievement) => void;
  addAchievementProgressToUser: (data: AddAchievementProgressToUserData, cb: (error: string | null) => void) => void;
  refreshOverlayLayout: (overlayId: string) => void;
}

export interface ClientToServerCustomRewards {
  createCustomReward: (data: CustomRewardCreateData, cb: (success: boolean) => void) => void;
  deleteCustomReward: (id: string, cb: (success: boolean) => void) => void;
  updateCustomReward: (id: string, data: CustomRewardCreateData, cb: (success: boolean) => void) => void;
  getCustomRewards: () => void;
}
export interface ClientToServerMusicEvents {
  changeVolume: (volume: number) => void;
  musicNext: () => void;
  musicPause: () => void;
  musicStop: () => void;
  musicPlay: () => void;
  loadPlaylist: (playlistId: string) => void;
  loadFolder: (folderName: string) => void;
  getAudioData: (cb: (data: AudioStreamDataEmitCb) => void) => void;
  addSongToPlayer: (songData: string) => void;
  sendBufferedInfo: (bufferedTime: number) => void;
}

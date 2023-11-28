import {
  CustomRewardCreateData,
  AudioStreamDataInfo,
  AudioYTData,
  AudioYTDataInfo,
  AudioStreamData,
  ObtainAchievementDataWithCollectedAchievement
} from "./dataTypes";

export interface ClientToServerEvents
  extends ClientToServerMusicLocalEvents,
    ClientToServerYoutubeEvents,
    ClientToServerCustomRewards {
  messageClient: (message: string) => void;
  saveConfigs: () => void;
  refreshTriggers: () => void;
  refreshCommands: () => void;
  refreshTimers: () => void;
  changeModes: () => void;
  logout: () => void;
  emulateAchievement: (data: ObtainAchievementDataWithCollectedAchievement) => void;
}

export interface ClientToServerCustomRewards {
  createCustomReward: (data: CustomRewardCreateData, cb: (success: boolean) => void) => void;
  deleteCustomReward: (id: string, cb: (success: boolean) => void) => void;
  updateCustomReward: (id: string, data: CustomRewardCreateData, cb: (success: boolean) => void) => void;
  getCustomRewards: () => void;
}

export interface ClientToServerMusicLocalEvents {
  musicPause: () => void;
  musicStop: () => void;
  musicPlay: () => void;
  musicNext: () => void;
  changeVolume: (volume: number) => void;
  getAudioStreamData: (cb: (isPlaying: boolean, data: AudioStreamData) => void) => void;
  loadSongs: (folderName: string) => void;
  getAudioInfo: (cb: (data: AudioStreamDataInfo) => void) => void;
}

export interface ClientToServerYoutubeEvents {
  changeYTVolume: (volume: number) => void;
  musicYTNext: () => void;
  musicYTPause: () => void;
  musicYTStop: () => void;
  musicYTPlay: () => void;
  loadYTPlaylist: (playlistId: string) => void;
  getAudioYTData: (cb: (isPlaying: boolean, data: AudioYTData) => void) => void;
  getAudioYTInfo: (cb: (data: AudioYTDataInfo) => void) => void;
}

import {
  EventAndUser,
  RewardData,
  CustomRewardData,
  MessageServerData,
  MessageServerDeleteData,
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
  AudioChunkData,
  RequestSongData,
  AudioStreamDataEmitCb
} from "./dataTypes";

export interface ServerToClientEvents extends ServerToClientMusicEvents {
  messageServer: (data: MessageServerData) => void;
  messageServerDelete: (data: MessageServerDeleteData) => void;
  userJoinTwitchChat: (eventAndUser: EventAndUser) => void;
  onRedemption: (data: RewardData, alertSound: Buffer) => void;

  forceReconnect: () => void;
  getCustomRewards: (data: CustomRewardData[]) => void;
  sendLoggedUserInfo: (username: string) => void;

  obtainAchievement: (
    data: ObtainAchievementDataWithCollectedAchievement | ObtainAchievementDataWithProgressOnly
  ) => void;
  obtainAchievementQueueInfo: (count: number) => void;
  refreshOverlayLayout: (overlayId: string) => void;
}

export interface ServerToClientMusicEvents {
  changeVolume: (volume: number) => void;
  musicNext: () => void;
  musicPause: (isPlaying: boolean) => void;
  musicStop: () => void;
  musicPlay: () => void;
  audioStreamData: (data: AudioStreamDataEmitCb) => void;
  audioChunk: (data: AudioChunkData) => void;
  requestSong: (data: RequestSongData) => void;
}

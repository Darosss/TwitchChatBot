import {
  EventAndUser,
  RewardData,
  CustomRewardData,
  AudioStreamData,
  AudioStreamDataInfo,
  AudioYTData,
  AudioYTDataInfo,
  ObtainAchievementData,
  MessageServerData,
  MessageServerDeleteData
} from "./dataTypes";

export interface ServerToClientEvents extends ServerToClientYoutubeEvents, ServerToClientMusicLocalEvents {
  noArg: () => void;
  withAck: (callback: (e: number) => void) => void;
  messageServer: (data: MessageServerData) => void;
  messageServerDelete: (data: MessageServerDeleteData) => void;
  userJoinTwitchChat: (eventAndUser: EventAndUser) => void;
  onRedemption: (data: RewardData, alertSound: Buffer) => void;

  forceReconnect: () => void;
  getCustomRewards: (data: CustomRewardData[]) => void;
  sendLoggedUserInfo: (username: string) => void;

  obtainAchievement: (data: ObtainAchievementData) => void;
  obtainAchievementQueueInfo: (count: number) => void;
}

export interface ServerToClientMusicLocalEvents {
  audio: (data: AudioStreamData) => void;
  audioStop: () => void;
  getAudioInfo: (data: AudioStreamDataInfo) => void;
  changeVolume: (volume: number) => void;
}

export interface ServerToClientYoutubeEvents {
  changeYTVolume: (volume: number) => void;
  musicYTNext: () => void;
  musicYTPause: () => void;
  musicYTStop: () => void;
  musicYTPlay: () => void;
  audioYT: (data: AudioYTData) => void;
  getAudioYTInfo: (data: AudioYTDataInfo) => void;
}

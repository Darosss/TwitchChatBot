export type EmitAudioNames = "audio" | "audioYT";
export type EmitPauseMusic = "audioStop" | "musicYTPause";
export type EmitChangeVolumeMusic = "changeVolume" | "changeYTVolume";
export interface SongProperties {
  id: string;
  name: string;
  duration: number;
}

export type EmitAudioNames = "audio" | "audioYT";
export type EmitPauseMusic = "audioStop" | "musicYTPause";
export type EmitChangeVolumeMusic = "changeVolume" | "changeYTVolume";
export interface SongProperties {
  id: string;
  name: string;
  duration: number;
}

export type MusicPlayerCommands =
  | "play"
  | "stop"
  | "resume"
  | "pause"
  | "skip"
  | "sr"
  | "when"
  | "previous"
  | "next"
  | "load"
  | "volume"
  | "like"
  | "dislike"
  | "unlike";

export interface AuthorizedUserData {
  id: string;
  name: string;
}

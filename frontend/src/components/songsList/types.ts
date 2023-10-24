import { SongCreateData, SongCustomTitle } from "@services";

export type DispatchAction =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_YOUTUBE_ID"; payload: string }
  | { type: "SET_CUSTOM_TITLE"; payload: SongCustomTitle }
  | { type: "SET_DURATION"; payload: number }
  | { type: "SET_CUSTOM_ID"; payload: string }
  | { type: "SET_WHO_ADDED"; payload: string }
  | { type: "SET_STATE"; payload: SongCreateData };

import CommandsHandler from "../CommandsHandler";
import EventSubHandler from "../EventSubHandler";
import LoyaltyHandler from "../LoyaltyHandler";
import MessagesHandler from "../MessagesHandler";
import MusicStreamHandler from "../MusicStreamHandler";
import MusicYTHandler from "../MusicYTHandler";
import TriggersHandler from "../TriggersHandler";
import StreamHandler from "stream/StreamHandler";
import TimersHandler from "stream/TimersHandler";
import ClientTmiHandler from "stream/TwitchTmiHandler";

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

export interface HandlersList {
  musicStreamHandler?: MusicStreamHandler;
  timersHandler?: TimersHandler;
  musicHandler?: MusicStreamHandler;
  musicYTHandler?: MusicYTHandler;
  commandsHandler?: CommandsHandler;
  messagesHandler?: MessagesHandler;
  triggersHandler?: TriggersHandler;
  loyaltyHandler?: LoyaltyHandler;
  eventSubHandler?: EventSubHandler;
  streamHandler?: StreamHandler;
  clientTmi?: ClientTmiHandler;
}

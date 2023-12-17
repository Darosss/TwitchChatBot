import { BaseModel } from "../types";
import { Document } from "mongoose";
import { TagModel } from "../tags";
import { MoodModel } from "../moods";

export type TriggerMode = "WHOLE-WORD" | "STARTS-WITH" | "ALL";

export interface TriggerModel extends BaseModel {
  name: string;
  enabled: boolean;
  chance: number;
  delay: number;
  onDelay: boolean;
  uses: number;
  words: string[];
  messages: string[];
  mode: TriggerMode;
  mood: string | MoodModel;
  tag: string | TagModel;
}

export type TriggerDocument = TriggerModel & Document;

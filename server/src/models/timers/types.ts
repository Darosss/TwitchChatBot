import { BaseModel } from "../types";
import { Document } from "mongoose";
import { TagModel } from "../tags";
import { MoodModel } from "../moods";

export interface TimerModel extends BaseModel {
  name: string;
  enabled: boolean;
  delay: number;
  points: number;
  reqPoints: number;
  nonFollowMulti: boolean;
  nonSubMulti: boolean;
  uses: number;
  messages: string[];
  description: string;
  mood: string | MoodModel;
  tag: string | TagModel;
}

export type TimerDocument = TimerModel & Document;

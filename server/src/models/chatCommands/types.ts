import { BaseModel } from "../types";
import { MoodModel } from "../moods";
import { TagModel } from "../tags";
import { Document } from "mongoose";

export interface ChatCommandModel extends BaseModel {
  name: string;
  description?: string;
  enabled: boolean;
  aliases: string[];
  messages: string[];
  privilege: number;
  uses: number;
  mood: string | MoodModel;
  tag: string | TagModel;
}

export type ChatCommandDocument = ChatCommandModel & Document;

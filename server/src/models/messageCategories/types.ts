import { Document } from "mongoose";
import { MoodModel } from "../moods";
import { TagModel } from "../tags";
import { BaseModel } from "../types";

export interface MessageCategoryModel extends BaseModel {
  name: string;
  enabled: boolean;
  messages: Array<[string, number]>;
  uses: number;
  mood: string | MoodModel;
  tag: string | TagModel;
}

export type MessageCategoryDocument = MessageCategoryModel & Document;

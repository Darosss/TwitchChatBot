import { BaseModel } from "../types";
import { Document } from "mongoose";

export interface MoodModel extends BaseModel {
  name: string;
  enabled: boolean;
}

export type MoodDocument = MoodModel & Document;

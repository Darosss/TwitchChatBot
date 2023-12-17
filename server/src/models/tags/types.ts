import { BaseModel } from "../types";
import { Document } from "mongoose";

export interface TagModel extends BaseModel {
  name: string;
  enabled: boolean;
}

export type TagDocument = TagModel & Document;

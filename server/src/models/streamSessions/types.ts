import { Document } from "mongoose";
import { BaseModel } from "../types";
import { UserModel } from "../users";

export interface SessionEventModel extends BaseModel {
  user: string | UserModel;
  name: string;
}

export interface StreamSessionModel {
  _id: string;
  sessionStart: Date;
  sessionEnd: Date;
  sessionTitles: Map<string, string>;
  categories: Map<string, string>;
  tags: Map<string, string>;
  viewers: Map<string, number>;
  watchers: Map<string, number>;
  events: SessionEventModel[];
}

export type StreamSessionDocument = StreamSessionModel & Document;

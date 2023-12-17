import { Document } from "mongoose";
import { BaseModel } from "../types";
import { UserModel } from "../users";

interface CustomTitle {
  band: string;
  title: string;
}

export interface SongsModel extends BaseModel {
  title: string;
  youtubeId: string;
  customTitle?: CustomTitle;
  duration: number;
  customId?: string;
  uses: number;
  usersUses: Map<string, number>;
  botUses: number;
  songRequestUses: number;
  whoAdded: string | UserModel;
  likes: Map<string, number>;
  enabled: boolean;
  lastUsed?: Date;
}

export type SongsDocument = SongsModel & Document;

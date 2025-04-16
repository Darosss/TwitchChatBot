import { Document } from "mongoose";
import { BaseModel } from "../types";
import { UserModel } from "../users";

export interface CustomTitle {
  band: string;
  title: string;
}

export interface DownloadedData {
  fileName: string;
  folderName: string;
  publicPath: string;
}

export interface SongsModel extends BaseModel {
  title: string;
  youtubeId?: string;
  sunoId?: string;
  localSong?: boolean;
  downloadedData?: DownloadedData;
  customTitle?: CustomTitle;
  customId?: string;
  duration: number;
  uses: number;
  usersUses: Map<string, number>;
  botUses: number;
  songRequestUses: number;
  whoAdded: UserModel;
  likes: Map<string, number>;
  enabled: boolean;
  lastUsed?: Date;
  tags: string;
}

export type SongsDocument = SongsModel & Document;

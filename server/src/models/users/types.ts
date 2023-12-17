import { Document } from "mongoose";
import { BaseModel } from "../types";
import { BadgeModel } from "../badges";

export type UserDisplayBadgesType = [BadgeModel, BadgeModel, BadgeModel];

export interface UserModel extends BaseModel {
  twitchId: string;
  username: string;
  privileges: number;
  points: number;
  watchTime: number;
  lastSeen?: Date;
  messageCount: number;
  notes?: string[];
  twitchName?: string;
  twitchCreated?: Date;
  follower?: Date;
  displayBadges?: UserDisplayBadgesType;
}

export type UserDocument = UserModel & Document;

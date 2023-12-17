import { Document } from "mongoose";
import { UserModel } from "../users";

export interface RedemptionModel {
  _id: string;
  rewardId: string;
  userId: string | UserModel;
  twitchId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: string;
  message?: string;
}

export type RedemptionDocument = RedemptionModel & Document;

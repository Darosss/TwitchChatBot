import { Model, model, Schema, Types } from "mongoose";
import { IRedemptionDocument } from "./types";

const RedeptionSchema: Schema<IRedemptionDocument> = new Schema({
  rewardId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  twitchId: { type: String, required: true },
  userName: { type: String, required: true },
  userDisplayName: { type: String, required: true },
  redemptionDate: { type: Date, required: true },
  rewardTitle: { type: String, required: true },
  rewardCost: { type: Number, required: true },
  rewardImage: { type: String },
  message: { type: String },
});

export const Redemption: Model<IRedemptionDocument> = model(
  "Redemptions",
  RedeptionSchema
);

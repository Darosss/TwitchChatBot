import { Model, model, Schema } from "mongoose";
import { RedemptionDocument } from "./types";

const RedemptionSchema: Schema<RedemptionDocument> = new Schema({
  rewardId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  twitchId: { type: String, required: true },
  userName: { type: String, required: true },
  userDisplayName: { type: String, required: true },
  redemptionDate: { type: Date, required: true },
  rewardTitle: { type: String, required: true },
  rewardCost: { type: Number, required: true },
  rewardImage: { type: String },
  message: { type: String }
});

export const Redemption: Model<RedemptionDocument> = model("Redemptions", RedemptionSchema);

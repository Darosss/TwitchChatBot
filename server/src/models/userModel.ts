import { Model, model, Schema } from "mongoose";
import { UserDocument } from "./types";

const UserSchema: Schema<UserDocument> = new Schema(
  {
    twitchId: { type: String, index: { unique: true }, required: true },
    username: { type: String },
    twitchName: { type: String },
    twitchCreated: { type: Date },
    follower: { type: Date },
    notes: { type: [String] },
    privileges: { type: Number, default: 0 },
    lastSeen: { type: Date, default: Date.now },
    points: { type: Number, default: 0 },
    watchTime: { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 },
    displayBadges: [
      { type: Schema.Types.ObjectId, ref: "Badge" },
      { type: Schema.Types.ObjectId, ref: "Badge" },
      { type: Schema.Types.ObjectId, ref: "Badge" }
    ]
  },
  { timestamps: true }
);

export const User: Model<UserDocument> = model("User", UserSchema);

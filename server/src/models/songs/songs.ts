import { Model, model, Schema } from "mongoose";
import { SongsDocument } from "./types";

const SongsSchema: Schema<SongsDocument> = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    youtubeId: {
      type: String
    },
    sunoId: {
      type: String
    },
    localSong: {
      type: Boolean
    },
    downloadedData: {
      fileName: { type: String },
      folderName: { type: String },
      publicPath: { type: String },
      required: false
    },
    customTitle: {
      band: {
        type: String,
        required: false
      },
      title: {
        type: String,
        required: false
      },
      required: false
    },
    uses: {
      type: Number,
      required: true,
      default: 0
    },
    usersUses: {
      type: Map,
      of: Number,
      default: new Map()
    },
    botUses: {
      type: Number,
      requried: true,
      default: 0
    },
    songRequestUses: {
      type: Number,
      requried: true,
      default: 0
    },
    duration: {
      type: Number,
      requried: true,
      default: 0
    },
    customId: {
      type: String,
      required: false
    },
    whoAdded: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    likes: {
      type: Map,
      of: Number,
      default: new Map()
    },
    lastUsed: { type: Date },
    enabled: { type: Boolean, default: true, required: true },
    tags: { type: String }
  },
  { timestamps: true }
);

export const Songs: Model<SongsDocument> = model("Songs", SongsSchema);

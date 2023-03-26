import { Model, model, Schema } from "mongoose";
import { ConfigDocument } from "./types";
import { configDefaults } from "../defaults/configsDefaults";
const {
  commandsConfigs,
  timersConfigs,
  triggersConfigs,
  pointsConfigs,
  loyaltyConfigs,
  chatGamesConfigs,
  headConfigs,
} = configDefaults;

const ConfigSchema: Schema<ConfigDocument> = new Schema(
  {
    commandsConfigs: {
      commandsPrefix: {
        type: String,
        required: true,
        default: commandsConfigs.commandsPrefix,
      },
    },
    timersConfigs: {
      timersIntervalDelay: {
        type: Number,
        required: true,
        default: timersConfigs.timersIntervalDelay,
      },
      nonFollowTimerPoints: {
        type: Number,
        required: true,
        default: timersConfigs.nonFollowTimerPoints,
      },
      nonSubTimerPoints: {
        type: Number,
        required: true,
        default: timersConfigs.nonSubTimerPoints,
      },
    },
    triggersConfigs: {
      randomMessageChance: {
        type: Number,
        required: true,
        default: triggersConfigs.randomMessageChance,
      },
    },
    pointsConfigs: {
      pointsIncrement: {
        message: {
          type: Number,
          requried: true,
          default: pointsConfigs.pointsIncrement.message,
        },
        watch: {
          type: Number,
          requried: true,
          default: pointsConfigs.pointsIncrement.watch,
        },
        watchMultipler: {
          type: Number,
          requried: true,
          default: pointsConfigs.pointsIncrement.watchMultipler,
        },
      },
    },
    loyaltyConfigs: {
      intervalCheckChatters: {
        type: Number,
        required: true,
        default: loyaltyConfigs.intervalCheckChatters,
      },
    },
    chatGamesConfigs: {
      activeUserTimeDelay: {
        type: Number,
        required: true,
        default: chatGamesConfigs.activeUserTimeDelay,
      },
      chatGamesIntervalDelay: {
        type: Number,
        required: true,
        default: chatGamesConfigs.chatGamesIntervalDelay,
      },
      minActiveUsersThreshold: {
        type: Number,
        required: true,
        default: chatGamesConfigs.minActiveUsersThreshold,
      },
    },
    headConfigs: {
      permissionLevels: {
        broadcaster: {
          type: Number,
          requried: true,
          default: headConfigs.permissionLevels.broadcaster,
        },
        mod: {
          type: Number,
          requried: true,
          default: headConfigs.permissionLevels.mod,
        },
        vip: {
          type: Number,
          requried: true,
          default: headConfigs.permissionLevels.vip,
        },
        all: {
          type: Number,
          requried: true,
          default: headConfigs.permissionLevels.all,
        },
      },
      intervalCheckViewersPeek: {
        type: Number,
        required: true,
        default: headConfigs.intervalCheckViewersPeek,
      },
    },
  },
  {
    capped: { size: 100000, max: 1 },
    timestamps: true,
  }
);

export const Config: Model<ConfigDocument> = model("Configs", ConfigSchema);

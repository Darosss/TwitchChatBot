import { Schema } from "mongoose";

export const prefixesField = {
  prefixes: {
    type: [String],
    default: [""]
  }
};
export const suffixesField = {
  suffixes: {
    type: [String],
    default: [""]
  }
};

export const suffixChanceField = {
  suffixChance: {
    type: Number,
    default: 30
  }
};
export const prefixChanceField = {
  prefixChance: {
    type: Number,
    default: 10
  }
};

export const nameField = {
  name: {
    type: String,
    required: true
  }
};

export const delayField = {
  delay: { type: Number, default: 360 }
};

export const descriptionField = { description: { type: String } };

export const baseChatFeaturesFields = {
  ...nameField,
  enabled: {
    type: Boolean,
    required: true,
    default: true
  }
};

export const chatFeaturesModeFields = {
  tag: { type: Schema.Types.ObjectId, required: true, ref: "Tags" },
  mood: { type: Schema.Types.ObjectId, required: true, ref: "Moods" }
};

export const commonChatFeaturesFields = {
  uses: {
    type: Number,
    required: true,
    default: 0
  },
  messages: [String],

  ...chatFeaturesModeFields
};

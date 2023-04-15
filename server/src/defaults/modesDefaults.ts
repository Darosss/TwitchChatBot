import { MoodCreateData } from "@services/moods/types";
import { PersonalityCreateData } from "@services/personalities/types";
import { TagCreateData } from "@services/tags/types";

export const getDefaultTag = () => {
  const defaultTag: TagCreateData = {
    name: "global",
  };
  return defaultTag;
};

export const getDefaultMood = () => {
  const defaultMood: MoodCreateData = {
    name: "global",
  };
  return defaultMood;
};

export const getDefaultPersonality = () => {
  const defaultPersonality: PersonalityCreateData = {
    name: "global",
  };
  return defaultPersonality;
};

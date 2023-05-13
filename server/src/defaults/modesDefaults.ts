import { MoodCreateData } from "@services/moods/types";
import { TagCreateData } from "@services/tags/types";

export const getDefaultTag = () => {
  const defaultTag: TagCreateData = {
    name: "global"
  };
  return defaultTag;
};

export const getDefaultMood = () => {
  const defaultMood: MoodCreateData = {
    name: "global"
  };
  return defaultMood;
};

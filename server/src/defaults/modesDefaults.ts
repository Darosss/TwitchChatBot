import { MoodCreateData, TagCreateData } from "@services";

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

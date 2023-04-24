import { PipelineStage } from "mongoose";

const tagsPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: "tags",
      localField: "tag",
      foreignField: "_id",
      as: "tag_info",
    },
  },
  // Unwind the tag_info array to access the fields of the tag document
  { $unwind: "$tag_info" },
];

const moodsPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: "moods",
      localField: "mood",
      foreignField: "_id",
      as: "mood_info",
    },
  },
  // Unwind the mood_info array to access the fields of the tag document
  { $unwind: "$mood_info" },
];

export const modesPipeline: PipelineStage[] = [
  ...tagsPipeline,
  ...moodsPipeline,
  {
    $match: {
      $and: [{ "tag_info.enabled": true }, { "mood_info.enabled": true }],
    },
  },
];

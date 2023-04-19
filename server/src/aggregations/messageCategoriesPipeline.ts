import { PipelineStage } from "mongoose";

export const getLeastMessagePipeline = (divideMessagesBy: number) => {
  const leastMessagePipeline: PipelineStage[] = [
    { $unwind: "$messages" },
    { $sort: { "messages.1": 1 } },
    { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    {
      $project: {
        _id: 1,

        leastUsedMessages: {
          $let: {
            vars: {
              sizeOfMessages: {
                $round: { $divide: [{ $size: "$messages" }, divideMessagesBy] },
              },
            },
            in: { $slice: ["$messages", "$$sizeOfMessages"] },
          },
        },
      },
    },
  ];

  return leastMessagePipeline;
};

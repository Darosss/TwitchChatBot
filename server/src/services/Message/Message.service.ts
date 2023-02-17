import { Message } from "@models/message.model";
import { IMessageDocument } from "@models/types";
import { FilterQuery } from "mongoose";
import { ManyMessageFindOptions, MessageCreateData } from "./types/Message";

export const getMessages = async (
  filter: FilterQuery<IMessageDocument> = {},
  messageFindOptions: ManyMessageFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = {},
    select = { __v: 0 },
    populateSelect = "id username",
  } = messageFindOptions;

  const messages = await Message.find(filter)
    .limit(limit * 1)
    .skip((skip - 1) * limit)
    .populate({ path: "owner", select: populateSelect })
    .select(select)
    .sort(sort);

  return messages;
};

export const createMessage = async (messageData: MessageCreateData) => {
  try {
    const message = await Message.create(messageData);
    return message;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create message");
  }
};

export const getMessagesCount = async (
  filter: FilterQuery<IMessageDocument>
) => {
  return await Message.countDocuments(filter);
};

export const getMostActiveUsersByMsgs = async (
  limit: number = 3,
  startDate?: Date,
  endDate?: Date
) => {
  const activeUsers = await Message.aggregate([
    {
      $match: {
        ...(startDate &&
          endDate && { date: { $gte: startDate, $lt: endDate } }),
      },
    },
    { $group: { _id: "$owner", messageCount: { $sum: 1 } } },
    {
      $sort: { messageCount: -1 },
    },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        username: "$user.username",
        messageCount: 1,
      },
    },
  ]);

  return activeUsers;
};

export const getMostUsedWord = async (
  limit: number = 3,
  startDate?: Date,
  endDate?: Date
) => {
  const mostUsedWords = await Message.aggregate([
    {
      $match: {
        ...(startDate &&
          endDate && {
            date: { $gte: startDate, $lt: endDate },
          }),
      },
    },
    { $project: { words: { $split: ["$message", " "] } } },
    { $unwind: "$words" },
    {
      $group: {
        _id: "$words",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);

  return mostUsedWords;
};

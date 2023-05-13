import { Message } from "@models/messageModel";
import { MessageDocument } from "@models/types";
import { handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { FilterQuery } from "mongoose";
import { ManyMessageFindOptions, MessageCreateData } from "./types";
export const getMessages = async (
  filter: FilterQuery<MessageDocument> = {},
  messageFindOptions: ManyMessageFindOptions
) => {
  const { limit = 50, skip = 1, sort = {}, select = { __v: 0 }, populateSelect = "id username" } = messageFindOptions;

  try {
    const messages = await Message.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .populate({ path: "owner", select: populateSelect })
      .select(select)
      .sort(sort);
    return messages;
  } catch (err) {
    logger.error(`Error occured while getting messages: ${err}`);
    handleAppError(err);
  }
};

export const createMessage = async (messageData: MessageCreateData) => {
  try {
    const message = await Message.create(messageData);
    return message;
  } catch (err) {
    logger.error(`Error occured while creating message: ${err}`);
    handleAppError(err);
  }
};

export const getMessagesCount = async (filter: FilterQuery<MessageDocument>) => {
  return await Message.countDocuments(filter);
};

export const getMostActiveUsersByMsgs = async (limit = 3, startDate: Date, endDate?: Date) => {
  const messageFilter = dateRangeMessageFilter(startDate, endDate, 5);

  try {
    const activeUsers = await Message.aggregate([
      {
        $match: messageFilter
      },
      { $group: { _id: "$owner", messageCount: { $sum: 1 } } },
      {
        $sort: { messageCount: -1 }
      },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          username: "$user.username",
          messageCount: 1
        }
      }
    ]);

    return activeUsers;
  } catch (err) {
    logger.error(`Error occured while aggregating messages for most active users: ${err}`);
    handleAppError(err);
  }
};

export const getMostUsedWord = async (limit = 3, startDate: Date, endDate?: Date) => {
  const messageFilter = dateRangeMessageFilter(startDate, endDate, 5);

  try {
    const mostUsedWords = await Message.aggregate([
      {
        $match: messageFilter
      },
      { $project: { words: { $split: ["$message", " "] } } },
      { $unwind: "$words" },
      {
        $group: {
          _id: "$words",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    return mostUsedWords;
  } catch (err) {
    logger.error(`Error occured while aggregating messages for most used words: ${err}`);
    handleAppError(err);
  }
};

export const getMessagesFromDateToDate = async (startDate: Date, endDate?: Date, addidionalHours = 1) => {
  const messagesFilter = dateRangeMessageFilter(startDate, endDate, addidionalHours);

  return await getMessages(messagesFilter, {});
};

export const getMessagesCountByDate = async (startDate: Date, endDate?: Date) => {
  const messagesFilter = dateRangeMessageFilter(startDate, endDate, 5);
  return await getMessagesCount(messagesFilter);
};

const dateRangeMessageFilter = (startDate: Date, endDate?: Date, additionalHours = 3) => {
  if (endDate)
    return {
      date: { $gte: startDate, $lt: endDate }
    };

  const customEndDate = new Date(startDate).setHours(startDate.getHours() + additionalHours);
  return {
    date: {
      $gte: startDate,
      $lt: new Date(customEndDate)
    }
  };
};

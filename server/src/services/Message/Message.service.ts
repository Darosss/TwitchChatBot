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

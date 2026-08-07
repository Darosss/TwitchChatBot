/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { MessageCreateData, MessageModel } from "@models";

jest.mock("@models", () => ({
  Message: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    aggregate: jest.fn()
  }
}));

import { Message } from "@models";
import * as MessagesService from "./messages";

const createFakeMessage = (): MessageModel & { owner: string } => ({
  _id: "message-1",
  message: "hello world",
  date: new Date("2024-01-01T00:00:00.000Z"),
  owner: "user-1",
  ownerUsername: "tester",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});

describe("Messages Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getMessages", () => {
    it("should query messages with pagination and return the result", async () => {
      const fakeMessages = [createFakeMessage()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeMessages as never)
      };

      const findSpy = jest.spyOn(Message, "find").mockReturnValue(queryChain as any);

      const result = await MessagesService.getMessages(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 }, populate: ["user"] }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.populate).toHaveBeenCalledWith(["user"]);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeMessages);
    });
  });

  describe("createMessage", () => {
    it("should create a message using MessageCreateData", async () => {
      const fakeMessage = createFakeMessage();
      const createSpy = jest.spyOn(Message, "create").mockResolvedValue(fakeMessage as any);
      const createData: MessageCreateData = {
        message: fakeMessage.message,
        date: fakeMessage.date,
        owner: fakeMessage.owner,
        ownerUsername: fakeMessage.ownerUsername
      };

      const result = await MessagesService.createMessage(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeMessage);
    });
  });

  describe("getMessagesCount", () => {
    it("should return the count of messages for a filter", async () => {
      const countSpy = jest.spyOn(Message, "countDocuments").mockResolvedValue(4 as any);

      const result = await MessagesService.getMessagesCount({ owner: "user-1" });

      expect(countSpy).toHaveBeenCalledWith({ owner: "user-1" });
      expect(result).toBe(4);
    });
  });

  describe("getMostActiveUsersByMsgs", () => {
    it("should aggregate the most active users by message count", async () => {
      const aggregateSpy = jest
        .spyOn(Message, "aggregate")
        .mockResolvedValue([{ _id: "user-1", username: "tester", messageCount: 2 }] as any);
      const startDate = new Date("2024-01-01T00:00:00.000Z");

      const result = await MessagesService.getMostActiveUsersByMsgs(3, startDate);

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual([{ _id: "user-1", username: "tester", messageCount: 2 }]);
    });
  });

  describe("getMostUsedWord", () => {
    it("should aggregate the most used words", async () => {
      const aggregateSpy = jest.spyOn(Message, "aggregate").mockResolvedValue([{ _id: "hello", count: 2 }] as any);
      const startDate = new Date("2024-01-01T00:00:00.000Z");

      const result = await MessagesService.getMostUsedWord(3, startDate);

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual([{ _id: "hello", count: 2 }]);
    });
  });

  describe("getMessagesFromDateToDate", () => {
    it("should call getMessages with the date range filter", async () => {
      const getMessagesSpy = jest.spyOn(MessagesService, "getMessages").mockResolvedValue([createFakeMessage()] as any);
      const startDate = new Date("2024-01-01T00:00:00.000Z");

      const result = await MessagesService.getMessagesFromDateToDate(startDate);

      expect(getMessagesSpy).toHaveBeenCalled();
      expect(result).toEqual([createFakeMessage()]);
    });
  });

  describe("getMessagesCountByDate", () => {
    it("should call getMessagesCount with the date range filter", async () => {
      const countSpy = jest.spyOn(MessagesService, "getMessagesCount").mockResolvedValue(2 as any);
      const startDate = new Date("2024-01-01T00:00:00.000Z");

      const result = await MessagesService.getMessagesCountByDate(startDate);

      expect(countSpy).toHaveBeenCalled();
      expect(result).toBe(2);
    });
  });
});

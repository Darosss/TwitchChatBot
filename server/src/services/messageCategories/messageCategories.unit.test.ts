/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  MessageCategory: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

jest.mock("../aggregations", () => ({
  modesPipeline: [{ $match: { mode: "enabled" } }],
  getLeastMessagePipeline: jest.fn(() => [{ $sort: { messages: 1 } }])
}));

jest.mock("mongoose", () => ({
  ...jest.requireActual<object>("mongoose"),
  Types: {
    //for BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
    ObjectId: jest.fn().mockImplementation(((value: string) => value) as unknown as jest.Mock)
  }
}));

import { MessageCategory, MessageCategoryCreateData, MessageCategoryModel } from "@models";
import * as MessageCategoriesService from "./messageCategories";

const createFakeCategory = () =>
  ({
    _id: "category-1",
    category: "greetings",
    enabled: true,
    name: "category-1-name",
    uses: 5,
    messages: [
      ["hello", 0],
      ["hi", 1]
    ],
    mood: "mood-id",
    tag: "tag-id",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  }) as MessageCategoryModel;

describe("Message Categories Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getMessageCategories", () => {
    it("should query message categories with pagination and populate options", async () => {
      const fakeCategories = [createFakeCategory()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeCategories as never)
      };

      const findSpy = jest.spyOn(MessageCategory, "find").mockReturnValue(queryChain as any);

      const result = await MessageCategoriesService.getMessageCategories(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 }, populate: ["user"] }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalledWith(["user"]);
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeCategories);
    });
  });

  describe("getMessageCategoriesCount", () => {
    it("should return the count of message categories for a filter", async () => {
      const countSpy = jest.spyOn(MessageCategory, "countDocuments").mockResolvedValue(3 as any);

      const result = await MessageCategoriesService.getMessageCategoriesCount({ enabled: true });

      expect(countSpy).toHaveBeenCalledWith({ enabled: true });
      expect(result).toBe(3);
    });
  });

  describe("getMessageCategoryById", () => {
    it("should return a message category when it exists", async () => {
      const fakeCategory = createFakeCategory();
      const selectMock = jest.fn().mockReturnThis();
      const populateMock = jest.fn().mockResolvedValue(fakeCategory as never);
      const findByIdSpy = jest
        .spyOn(MessageCategory, "findById")
        .mockReturnValue({ select: selectMock, populate: populateMock } as any);

      const result = await MessageCategoriesService.getMessageCategoryById("category-1", {
        select: { __v: 0 },
        populate: ["user"]
      });

      expect(findByIdSpy).toHaveBeenCalledWith("category-1");
      expect(selectMock).toHaveBeenCalledWith({ __v: 0 });
      expect(populateMock).toHaveBeenCalledWith(["user"]);
      expect(result).toBe(fakeCategory);
    });
  });

  describe("getMessagesByCategory", () => {
    it("should return the messages from an existing category", async () => {
      const fakeCategory = createFakeCategory();
      jest.spyOn(MessageCategory, "findOne").mockResolvedValue(fakeCategory as any);

      const result = await MessageCategoriesService.getMessagesByCategory("greetings");

      expect(result).toEqual(fakeCategory.messages);
    });
  });

  describe("getRandomCategoryMessage", () => {
    it("should return a random category message from aggregate results", async () => {
      const fakeCategory = createFakeCategory();
      const aggregateSpy = jest.spyOn(MessageCategory, "aggregate").mockResolvedValue([fakeCategory] as any);

      const result = await MessageCategoriesService.getRandomCategoryMessage(false);

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual(fakeCategory);
    });
  });

  describe("getLeastUsedMessagesFromMessageCategory", () => {
    it("should return the least used messages for a category", async () => {
      const aggregateSpy = jest
        .spyOn(MessageCategory, "aggregate")
        .mockResolvedValue([{ leastUsedMessages: ["hello"] }] as any);

      const result = await MessageCategoriesService.getLeastUsedMessagesFromMessageCategory("category-1", 3);

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual(["hello"]);
    });
  });

  describe("getLeastMessagesFromEnabledCategories", () => {
    it("should return the least used messages from enabled categories", async () => {
      const aggregateSpy = jest
        .spyOn(MessageCategory, "aggregate")
        .mockResolvedValue([{ leastUsedMessages: [[["hello", "category-1"]]] }] as any);

      const result = await MessageCategoriesService.getLeastMessagesFromEnabledCategories(false, 3);

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual([["hello", "category-1"]]);
    });
  });

  describe("createMessageCategories", () => {
    it("should create a message category and transform messages to tuple pairs", async () => {
      const fakeCategory = createFakeCategory();
      const createSpy = jest.spyOn(MessageCategory, "create").mockResolvedValue(fakeCategory as any);
      const createData: MessageCategoryCreateData = {
        messages: ["hello", "hi"],
        enabled: true,
        name: "new-test-category",
        tag: "tag-id",
        mood: "mood-id"
      };

      const result = await MessageCategoriesService.createMessageCategories(createData);

      expect(createSpy).toHaveBeenCalledWith({
        name: "new-test-category",
        messages: [
          ["hello", 0],
          ["hi", 0]
        ],
        tag: "tag-id",
        mood: "mood-id",
        enabled: true
      });
      expect(result).toBe(fakeCategory);
    });
  });

  describe("updateMessageCategoryById", () => {
    it("should update a message category and preserve message usage counts", async () => {
      const fakeCategory = createFakeCategory();
      jest.spyOn(MessageCategoriesService as any, "getMessageCategoryById").mockResolvedValue(fakeCategory as any);
      const updateSpy = jest.spyOn(MessageCategory, "findByIdAndUpdate").mockResolvedValue(fakeCategory as any);

      const result = await MessageCategoriesService.updateMessageCategoryById("category-1", {
        messages: ["hello", "hi"]
      } as any);

      expect(updateSpy).toHaveBeenCalled();
      expect(result).toBe(fakeCategory);
    });
  });

  describe("findCategoryAndUpdateMessageUse", () => {
    it("should increment the usage count for the matching message", async () => {
      const fakeCategory = createFakeCategory();
      const updateSpy = jest.spyOn(MessageCategory, "findOneAndUpdate").mockResolvedValue(fakeCategory as any);

      const result = await MessageCategoriesService.findCategoryAndUpdateMessageUse("category-1", "hello");

      expect(updateSpy).toHaveBeenCalledWith(
        { _id: "category-1", "messages.0": { $exists: true } },
        { $inc: { "messages.$[elem].1": 1 } },
        {
          arrayFilters: [{ "elem.0": "hello" }],
          useFindAndModify: false,
          new: true
        }
      );
      expect(result).toBe(fakeCategory);
    });
  });

  describe("deleteMessageCategory", () => {
    it("should delete a message category and return it", async () => {
      const fakeCategory = createFakeCategory();
      const deleteSpy = jest.spyOn(MessageCategory, "findByIdAndDelete").mockResolvedValue(fakeCategory as any);

      const result = await MessageCategoriesService.deleteMessageCategory("category-1");

      expect(deleteSpy).toHaveBeenCalledWith("category-1");
      expect(result).toBe(fakeCategory);
    });
  });
});

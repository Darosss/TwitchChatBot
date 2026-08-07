/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  Tag: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn()
  }
}));

jest.mock("@services", () => ({
  getAchievementsCount: jest.fn(),
  getChatCommandsCount: jest.fn(),
  getMessageCategoriesCount: jest.fn(),
  getTimersCount: jest.fn(),
  getTriggersCount: jest.fn()
}));

import { Tag, TagCreateData, TagModel } from "@models";
import {
  getAchievementsCount,
  getChatCommandsCount,
  getMessageCategoriesCount,
  getTimersCount,
  getTriggersCount
} from "@services";
import * as TagsService from "./tags";

const createFakeTag = (): TagModel => ({
  _id: "tag-1",
  name: "Test Tag",
  enabled: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

describe("Tags Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getTags", () => {
    it("should query tags with pagination and return the result", async () => {
      const fakeTags = [createFakeTag()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeTags as never)
      };

      const findSpy = jest.spyOn(Tag, "find").mockReturnValue(queryChain as any);

      const result = await TagsService.getTags({}, { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } });

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeTags);
    });
  });

  describe("getTagsCount", () => {
    it("should return the count of tags for a filter", async () => {
      const countSpy = jest.spyOn(Tag, "countDocuments").mockResolvedValue(3 as any);

      const result = await TagsService.getTagsCount({ name: "Test Tag" });

      expect(countSpy).toHaveBeenCalledWith({ name: "Test Tag" });
      expect(result).toBe(3);
    });
  });

  describe("createTag", () => {
    it("should create a tag and return it", async () => {
      const fakeTag = createFakeTag();
      const createSpy = jest.spyOn(Tag, "create").mockResolvedValue(fakeTag as any);
      const createData: TagCreateData = { name: fakeTag.name, enabled: fakeTag.enabled };

      const result = await TagsService.createTag(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeTag);
    });
  });

  describe("updateTags", () => {
    it("should update many tags with the given filter and data", async () => {
      const updateManySpy = jest.spyOn(Tag, "updateMany").mockResolvedValue({} as any);

      await TagsService.updateTags({ name: "Test Tag" }, { name: "Updated Tag" });

      expect(updateManySpy).toHaveBeenCalledWith({ name: "Test Tag" }, { name: "Updated Tag" });
    });
  });

  describe("updateTagById", () => {
    it("should update a tag and return it", async () => {
      const fakeTag = createFakeTag();
      const updateSpy = jest.spyOn(Tag, "findByIdAndUpdate").mockResolvedValue(fakeTag as any);

      const result = await TagsService.updateTagById(fakeTag._id, { name: "Updated Tag" });

      expect(updateSpy).toHaveBeenCalledWith(fakeTag._id, { name: "Updated Tag" }, { new: true });
      expect(result).toBe(fakeTag);
    });
  });

  describe("deleteTagById", () => {
    it("should delete a tag when it is not used elsewhere", async () => {
      const fakeTag = createFakeTag();
      const deleteSpy = jest.spyOn(Tag, "findByIdAndDelete").mockResolvedValue(fakeTag as any);
      jest.mocked(getTriggersCount).mockResolvedValue(0 as any);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0 as any);
      jest.mocked(getTimersCount).mockResolvedValue(0 as any);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0 as any);
      jest.mocked(getAchievementsCount).mockResolvedValue(0 as any);

      const result = await TagsService.deleteTagById(fakeTag._id);

      expect(deleteSpy).toHaveBeenCalledWith(fakeTag._id);
      expect(result).toBe(fakeTag);
    });

    it("should throw when the tag is used by another document", async () => {
      jest.mocked(getTriggersCount).mockResolvedValue(1 as any);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0 as any);
      jest.mocked(getTimersCount).mockResolvedValue(0 as any);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0 as any);
      jest.mocked(getAchievementsCount).mockResolvedValue(0 as any);

      await expect(TagsService.deleteTagById("tag-1")).rejects.toThrow();
    });
  });

  describe("getTagById", () => {
    it("should return a tag when one exists", async () => {
      const fakeTag = createFakeTag();
      const findByIdSpy = jest.spyOn(Tag, "findById").mockResolvedValue(fakeTag as any);

      const result = await TagsService.getTagById(fakeTag._id, { name: 1 });

      expect(findByIdSpy).toHaveBeenCalledWith(fakeTag._id, { name: 1 });
      expect(result).toBe(fakeTag);
    });
  });

  describe("getOneTag", () => {
    it("should return the first matching tag", async () => {
      const fakeTag = createFakeTag();
      jest.spyOn(Tag, "findOne").mockResolvedValue(fakeTag as any);

      const result = await TagsService.getOneTag({ name: "Test Tag" });

      expect(result).toBe(fakeTag);
    });
  });
});

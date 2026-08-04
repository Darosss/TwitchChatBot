/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  Mood: {
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
  getChatCommandsCount: jest.fn(),
  getMessageCategoriesCount: jest.fn(),
  getTimersCount: jest.fn(),
  getTriggersCount: jest.fn()
}));

import { Mood, MoodModel, MoodCreateData } from "@models";
import { getChatCommandsCount, getMessageCategoriesCount, getTimersCount, getTriggersCount } from "@services";
import * as MoodsService from "./moods";

const createFakeMood = () =>
  ({
    _id: "mood-1",
    name: "Happy",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  }) as MoodModel;

describe("Moods Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getMoods", () => {
    it("should query moods with pagination and return the result", async () => {
      const fakeMoods = [createFakeMood()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeMoods as never)
      };

      const findSpy = jest.spyOn(Mood, "find").mockReturnValue(queryChain as any);

      const result = await MoodsService.getMoods(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeMoods);
    });
  });

  describe("getMoodsCount", () => {
    it("should return the count of moods for a filter", async () => {
      const countSpy = jest.spyOn(Mood, "countDocuments").mockResolvedValue(3 as any);

      const result = await MoodsService.getMoodsCount({ name: "Happy" });

      expect(countSpy).toHaveBeenCalledWith({ name: "Happy" });
      expect(result).toBe(3);
    });
  });

  describe("createMood", () => {
    it("should create a mood and return it", async () => {
      const fakeMood = createFakeMood();
      const createSpy = jest.spyOn(Mood, "create").mockResolvedValue(fakeMood as any);
      const createData: MoodCreateData = { name: "Happy", enabled: true };

      const result = await MoodsService.createMood(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeMood);
    });
  });

  describe("updateMoods", () => {
    it("should update many moods with the given filter and data", async () => {
      const updateManySpy = jest.spyOn(Mood, "updateMany").mockResolvedValue({} as any);

      await MoodsService.updateMoods({ name: "Happy" }, { name: "Excited" });

      expect(updateManySpy).toHaveBeenCalledWith({ name: "Happy" }, { name: "Excited" });
    });
  });

  describe("updateMoodById", () => {
    it("should update a mood and return it", async () => {
      const fakeMood = createFakeMood();
      const updateSpy = jest.spyOn(Mood, "findByIdAndUpdate").mockResolvedValue(fakeMood as any);

      const result = await MoodsService.updateMoodById("mood-1", { name: "Excited" });

      expect(updateSpy).toHaveBeenCalledWith("mood-1", { name: "Excited" }, { new: true });
      expect(result).toBe(fakeMood);
    });
  });

  describe("deleteMoodById", () => {
    it("should delete a mood when it is not used elsewhere", async () => {
      const fakeMood = createFakeMood();
      const deleteSpy = jest.spyOn(Mood, "findByIdAndDelete").mockResolvedValue(fakeMood as any);
      jest.mocked(getTriggersCount).mockResolvedValue(0 as any);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0 as any);
      jest.mocked(getTimersCount).mockResolvedValue(0 as any);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0 as any);

      const result = await MoodsService.deleteMoodById("mood-1");

      expect(deleteSpy).toHaveBeenCalledWith("mood-1");
      expect(result).toBe(fakeMood);
    });

    it("should throw when the mood is used by another document", async () => {
      jest.mocked(getTriggersCount).mockResolvedValue(1 as any);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0 as any);
      jest.mocked(getTimersCount).mockResolvedValue(0 as any);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0 as any);

      await expect(MoodsService.deleteMoodById("mood-1")).rejects.toThrow();
    });
  });

  describe("getMoodById", () => {
    it("should return a mood when one exists", async () => {
      const fakeMood = createFakeMood();
      const findByIdSpy = jest.spyOn(Mood, "findById").mockResolvedValue(fakeMood as any);

      const result = await MoodsService.getMoodById("mood-1", { name: 1 });

      expect(findByIdSpy).toHaveBeenCalledWith("mood-1", { name: 1 });
      expect(result).toBe(fakeMood);
    });
  });

  describe("getOneMood", () => {
    it("should return the first matching mood", async () => {
      const fakeMood = createFakeMood();
      jest.spyOn(Mood, "findOne").mockResolvedValue(fakeMood as any);

      const result = await MoodsService.getOneMood({ name: "Happy" });

      expect(result).toBe(fakeMood);
    });
  });
});

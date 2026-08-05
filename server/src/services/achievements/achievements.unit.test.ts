/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  CustomAchievementAction: jest.requireActual<any>("../../models/achievements/enums")
    .CustomAchievementAction as typeof CustomAchievementAction,
  Achievement: {
    find: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn()
  }
}));
import { Achievement, CustomAchievementAction } from "@models";
import * as AchievementsService from "./achievements";

const createFakeAchievement = () => ({
  _id: "achievement-1",
  name: "Test Achievement",
  stages: [],
  tag: { name: "test", enabled: true },
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});

describe("Achievements Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAchievements", () => {
    it("should query achievements with pagination and populate stages and tag", async () => {
      const fakeAchievements = [createFakeAchievement()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeAchievements as never)
      };

      const findSpy = jest.spyOn(Achievement, "find").mockReturnValue(queryChain as any);

      const result = await AchievementsService.getAchievements(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } },
        { stages: true, stagesBadge: true, tag: true }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalled();
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeAchievements);
    });
  });

  describe("createAchievement", () => {
    it("should create a new achievement", async () => {
      const fakeAchievement = createFakeAchievement();
      const createSpy = jest.spyOn(Achievement, "create").mockResolvedValue(fakeAchievement as any);

      const result = await AchievementsService.createAchievement({ name: "Test Achievement" } as any);

      expect(createSpy).toHaveBeenCalledWith({ name: "Test Achievement" });
      expect(result).toBe(fakeAchievement);
    });
  });

  describe("getAchievementsCount", () => {
    it("should return the count of achievements", async () => {
      const countSpy = jest.spyOn(Achievement, "countDocuments").mockResolvedValue(7 as any);

      const result = await AchievementsService.getAchievementsCount({ name: "Test Achievement" });

      expect(countSpy).toHaveBeenCalledWith({ name: "Test Achievement" });
      expect(result).toBe(7);
    });
  });

  describe("getOneAchievement", () => {
    it("should find one achievement and populate stages and tag", async () => {
      const fakeAchievement = createFakeAchievement();
      const queryChain = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(fakeAchievement as never)
      };

      const findOneSpy = jest.spyOn(Achievement, "findOne").mockReturnValue(queryChain as any);

      const result = await AchievementsService.getOneAchievement({}, { select: { __v: 0 } }, true);

      expect(findOneSpy).toHaveBeenCalledWith({});
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalled();
      expect(result).toEqual(fakeAchievement);
    });
  });

  describe("updateOneAchievement", () => {
    it("should update an achievement and return it", async () => {
      const fakeAchievement = createFakeAchievement();
      const updateSpy = jest.spyOn(Achievement, "findOneAndUpdate").mockResolvedValue(fakeAchievement as any);

      const result = await AchievementsService.updateOneAchievement(
        { name: "Test Achievement" },
        { $set: { name: "Updated" } }
      );

      expect(updateSpy).toHaveBeenCalledWith(
        { name: "Test Achievement" },
        { $set: { name: "Updated" } },
        { new: true }
      );
      expect(result).toEqual(fakeAchievement);
    });
  });

  describe("createCustomAchievement", () => {
    it("should create a custom achievement with valid includes action", async () => {
      const fakeAchievement = createFakeAchievement();
      const createSpy = jest.spyOn(Achievement, "create").mockResolvedValue(fakeAchievement as any);

      const result = await AchievementsService.createCustomAchievement({
        name: "Custom Achievement",
        custom: { action: CustomAchievementAction.INCLUDES, stringValues: ["hello"] },
        description: "custom achievement description",
        stages: "stages-id" as any, //no need to make ObjectId for unit test
        tag: "tag-id"
      });
      console.log(result);
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({ isTime: false }));
      expect(result).toBe(fakeAchievement);
    });

    it("should throw when custom includes action has no string values", async () => {
      await expect(
        AchievementsService.createCustomAchievement({
          name: "Custom Achievement",
          custom: { action: CustomAchievementAction.INCLUDES, stringValues: [] },
          description: "custom achievement description",
          stages: "stages-id" as any, //no need to make ObjectId for unit test
          tag: "tag-id"
        })
      ).rejects.toThrow();
    });

    it("should throw when custom message action has no number value", async () => {
      await expect(
        AchievementsService.createCustomAchievement({
          name: "Custom Achievement",
          custom: { action: CustomAchievementAction.MESSAGE_GT },
          description: "custom achievement description",
          stages: "stages-id" as any, //no need to make ObjectId for unit test
          tag: "tag-id"
        })
      ).rejects.toThrow();
    });
  });

  describe("deleteOneAchievement", () => {
    it("should delete an achievement by filter and return a success message", async () => {
      const deleteSpy = jest.spyOn(Achievement, "findOneAndDelete").mockResolvedValue(createFakeAchievement() as any);

      const result = await AchievementsService.deleteOneAchievement({ name: "Test Achievement" });

      expect(deleteSpy).toHaveBeenCalledWith({ name: "Test Achievement" });
      expect(result).toEqual({ message: "Successfully removed achievement" });
    });
  });

  describe("deleteCustomAchievementById", () => {
    it("should delete a custom achievement by id", async () => {
      const deleteSpy = jest.spyOn(Achievement, "findOneAndDelete").mockResolvedValue(createFakeAchievement() as any);

      const result = await AchievementsService.deleteCustomAchievementById("achievement-1");

      expect(deleteSpy).toHaveBeenCalledWith({ _id: "achievement-1", custom: { $exists: true } });
      expect(result).toEqual({ message: "Successfully removed custom achievement" });
    });
  });
});

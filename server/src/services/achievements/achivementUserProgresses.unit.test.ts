/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  AchievementUserProgress: {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn()
  }
}));

jest.mock("@services", () => ({
  getOneAchievement: jest.fn(),
  getUserById: jest.fn()
}));

import { AchievementUserProgress, AchievementUserProgressModel, AchievementWithBadgePopulated } from "@models";
import { getUserById } from "@services";
import * as AchievementUserProgressesService from "./achivementUserProgresses";

const createFakeTag = () => ({
  _id: "tag-1"
});
const createFakeAchievement = (): AchievementWithBadgePopulated => ({
  _id: "achievement-1" as any, // no need to be a valid ObjectId for testing
  name: "Test Achievement",
  stages: {
    stageData: [
      {
        stage: 1,
        goal: 5,
        name: "badge-1",
        badge: {
          _id: "badge-id-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          name: "badge-name-1",
          imagesUrls: {
            x32: "x32.png",
            x64: "x64.png",
            x96: "x96.png",
            x128: "x128.png"
          }
        },
        showTimeMs: 500
      },
      {
        stage: 2,
        goal: 10,
        name: "badge-2",
        badge: {
          _id: "badge-id-2",
          createdAt: new Date(),
          updatedAt: new Date(),
          name: "badge-name-2",
          imagesUrls: {
            x32: "x32.png",
            x64: "x64.png",
            x96: "x96.png",
            x128: "x128.png"
          }
        },
        showTimeMs: 1000
      }
    ],
    name: "stage-name",
    _id: "stage-id" as any, // no need to be a valid ObjectId for testing
    createdAt: new Date(),
    updatedAt: new Date()
  }, // no need to be a valid ObjectId for testing
  tag: createFakeTag()._id,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  description: "",
  isTime: false,
  enabled: false
});

const createFakeProgress = (): AchievementUserProgressModel => ({
  _id: "progress-1" as any, // no need to be a valid ObjectId for testing,
  achievement: createFakeAchievement()._id as any, // no need to be a valid ObjectId for testing,
  userId: "user-1",
  value: 5,
  progresses: [],
  progressesLength: 0,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});

describe("Achievement User Progresses Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAchievementUserProgresses", () => {
    it("should query progress documents with populate options", async () => {
      const fakeProgresses = [createFakeProgress()];
      const queryChain = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(fakeProgresses as never)
      };
      const findSpy = jest.spyOn(AchievementUserProgress, "find").mockReturnValue(queryChain as any);

      const result = await AchievementUserProgressesService.getAchievementUserProgresses(
        {},
        { select: { __v: 0 }, populate: { achievements: { value: true, stages: { value: true, badges: true } } } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalled();
      expect(result).toEqual(fakeProgresses);
    });
  });

  describe("getOneAchievementUserProgress", () => {
    it("should return a single achievement progress", async () => {
      const fakeProgress = createFakeProgress();
      const findOneSpy = jest.spyOn(AchievementUserProgress, "findOne").mockResolvedValue(fakeProgress as any);

      const result = await AchievementUserProgressesService.getOneAchievementUserProgress({
        achievement: createFakeAchievement()._id
      });

      expect(findOneSpy).toHaveBeenCalledWith({ achievement: createFakeAchievement()._id });
      expect(result).toEqual(fakeProgress);
    });
  });

  describe("createAchievementUserProgress", () => {
    it("should return existing progress when one exists", async () => {
      const fakeProgress = createFakeProgress();
      jest
        .spyOn(AchievementUserProgressesService, "getOneAchievementUserProgress")
        .mockResolvedValue(fakeProgress as any);

      const result = await AchievementUserProgressesService.createAchievementUserProgress({
        achievement: fakeProgress.achievement,
        userId: fakeProgress.userId
      });

      expect(result).toBe(fakeProgress);
    });

    it("should create a new progress when none exists", async () => {
      jest.spyOn(AchievementUserProgressesService, "getOneAchievementUserProgress").mockResolvedValue(null as any);
      const fakeProgress = createFakeProgress();
      const createSpy = jest.spyOn(AchievementUserProgress, "create").mockResolvedValue(fakeProgress as any);

      const result = await AchievementUserProgressesService.createAchievementUserProgress({
        achievement: fakeProgress.achievement,
        userId: fakeProgress.userId
      });

      expect(createSpy).toHaveBeenCalledWith({ achievement: fakeProgress.achievement, userId: fakeProgress.userId });
      expect(result).toBe(fakeProgress);
    });
  });

  describe("updateOneAchievementUserProgress", () => {
    it("should update progress and set progressesLength when progresses are passed", async () => {
      const fakeProgress = createFakeProgress();
      jest
        .spyOn(AchievementUserProgress, "findOne")
        .mockResolvedValue({ ...fakeProgress, progresses: [[1, 100]] } as any);
      const updateSpy = jest.spyOn(AchievementUserProgress, "findByIdAndUpdate").mockResolvedValue(fakeProgress as any);

      const result = await AchievementUserProgressesService.updateOneAchievementUserProgress(
        { _id: fakeProgress._id },
        { progresses: [[1, 100]] }
      );

      expect(updateSpy).toHaveBeenCalledWith(
        fakeProgress._id,
        expect.objectContaining({ progresses: [[1, 100]], $set: { progressesLength: 1 } }),
        { new: true }
      );
      expect(result).toEqual(fakeProgress);
    });
  });

  describe("getAchievementsProgressesByUserId", () => {
    it("should return progress documents when the user exists", async () => {
      const fakeProgresses = [createFakeProgress()];
      jest.mocked(getUserById).mockResolvedValue({ id: "user-1" } as any);
      const queryChain = {
        populate: jest.fn().mockResolvedValue(fakeProgresses as never)
      };
      const findSpy = jest.spyOn(AchievementUserProgress, "find").mockReturnValue(queryChain as any);

      const result = await AchievementUserProgressesService.getAchievementsProgressesByUserId("user-1");

      expect(getUserById).toHaveBeenCalledWith("user-1", {});
      expect(findSpy).toHaveBeenCalledWith({ userId: "user-1" });
      expect(queryChain.populate).toHaveBeenCalledWith({
        path: "achievement",
        populate: {
          path: "stages",
          populate: {
            path: "stageData.badge"
          }
        }
      });
      expect(result).toEqual(fakeProgresses);
    });
  });

  describe("updateFinishedStagesDependsOnProgress", () => {
    it("should finish stages when progress passes stage goals", async () => {
      const fakeAchievement = createFakeAchievement();
      const userProgress = { _id: fakeAchievement.stages._id, progresses: [] } as any;
      jest
        .spyOn(AchievementUserProgressesService, "updateOneAchievementUserProgress")
        .mockResolvedValue(userProgress as any);

      const result = await AchievementUserProgressesService.updateFinishedStagesDependsOnProgress(
        fakeAchievement,
        userProgress,
        6
      );

      expect(result.nowFinishedStages.length).toBeGreaterThan(0);
      expect(result.gainedProgress).toBeNull();
    });
  });

  describe("getDataForObtainAchievementEmit", () => {
    it("should build emit data with stages and gained progress", () => {
      const data = {
        foundAchievement: {
          name: "Test Achievement",
          isTime: false,
          stages: {
            stageData: [
              { stage: 1, goal: 5 },
              { stage: 2, goal: 10 }
            ]
          }
        },
        nowFinishedStages: [[1, 123456]],
        gainedProgress: { currentStageNumber: null, nextStageNumber: 1, progress: 6 }
      } as any;

      const result = AchievementUserProgressesService.getDataForObtainAchievementEmit(data);

      expect(result.achievement).toEqual({ name: "Test Achievement", isTime: false });
      expect(result.stages).toEqual([{ data: { stage: 1, goal: 5 }, timestamp: 123456 }]);
      expect(result.gainedProgress).toEqual(expect.objectContaining({ progress: 6 }));
    });
  });
});

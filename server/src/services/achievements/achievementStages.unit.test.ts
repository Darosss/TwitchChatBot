/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  AchievementStage: {
    find: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

jest.mock("./achievements", () => ({
  getAchievements: jest.fn()
}));

jest.mock("fs", () => {
  const actualFs = jest.requireActual<any>("fs");
  return {
    ...actualFs,
    promises: {
      ...actualFs.promises,
      unlink: jest.fn()
    }
  };
});

import { promises as fsPromises } from "fs";
import { AchievementStage, AchievementStageModel } from "@models";
import { getAchievements } from "./achievements";
import * as AchievementStagesService from "./achievementStages";

const createFakeStage = (): AchievementStageModel => ({
  _id: "stage-1" as any, // no need to be a valid ObjectId for testing
  name: "Stage 1",
  stageData: [
    {
      name: "Stage 1",
      stage: 1,
      goal: 10,
      badge: "badge id" as any, // no need to be a valid ObjectId for testing
      showTimeMs: 2000
    }
  ],
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});

describe("Achievement Stages Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAchievementStages", () => {
    it("should query achievement stages with pagination and return the result", async () => {
      const fakeStages = [createFakeStage()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeStages as never)
      };

      const findSpy = jest.spyOn(AchievementStage, "find").mockReturnValue(queryChain as any);

      const result = await AchievementStagesService.getAchievementStages(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeStages);
    });
  });

  describe("createAchievementStage", () => {
    it("should create a new achievement stage", async () => {
      const fakeStage = createFakeStage();
      const createSpy = jest.spyOn(AchievementStage, "create").mockResolvedValue(fakeStage as any);

      const result = await AchievementStagesService.createAchievementStage({
        name: fakeStage.name,
        stageData: fakeStage.stageData
      });

      expect(createSpy).toHaveBeenCalledWith({ name: fakeStage.name, stageData: fakeStage.stageData });
      expect(result).toBe(fakeStage);
    });
  });

  describe("getAchievementStagesCount", () => {
    it("should return the count of achievement stages", async () => {
      const countSpy = jest.spyOn(AchievementStage, "countDocuments").mockResolvedValue(4 as any);

      const result = await AchievementStagesService.getAchievementStagesCount({ name: "Stage 1" });

      expect(countSpy).toHaveBeenCalledWith({ name: "Stage 1" });
      expect(result).toBe(4);
    });
  });

  describe("getOneAchievementStage", () => {
    it("should find one achievement stage by filter", async () => {
      const fakeStage = createFakeStage();
      const queryChain = {
        select: jest.fn().mockResolvedValue(fakeStage as never)
      };

      const findOneSpy = jest.spyOn(AchievementStage, "findOne").mockReturnValue(queryChain as any);

      const result = await AchievementStagesService.getOneAchievementStage({}, { select: { __v: 0 } });

      expect(findOneSpy).toHaveBeenCalledWith({});
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(result).toEqual(fakeStage);
    });
  });

  describe("updateOneAchievementStage", () => {
    it("should update an achievement stage and return it", async () => {
      const fakeStage = createFakeStage();
      const updateSpy = jest.spyOn(AchievementStage, "findOneAndUpdate").mockResolvedValue(fakeStage as any);

      const result = await AchievementStagesService.updateOneAchievementStage(
        { name: "Stage 1" },
        { $set: { name: "Updated" } }
      );

      expect(updateSpy).toHaveBeenCalledWith({ name: "Stage 1" }, { $set: { name: "Updated" } }, { new: true });
      expect(result).toEqual(fakeStage);
    });
  });

  describe("getAchievementStagesById", () => {
    it("should find a stage by id and populate badge when requested", async () => {
      const fakeStage = createFakeStage();
      const queryChain = {
        populate: jest.fn().mockResolvedValue(fakeStage as never)
      };
      const findByIdSpy = jest.spyOn(AchievementStage, "findById").mockReturnValue(queryChain as any);

      const result = await AchievementStagesService.getAchievementStagesById(
        fakeStage._id.toString(),
        {},
        { stageDataBadge: true }
      );

      expect(findByIdSpy).toHaveBeenCalledWith(fakeStage._id, {});
      expect(queryChain.populate).toHaveBeenCalledWith([{ path: "stageData.badge" }]);
      expect(result).toEqual(fakeStage);
    });
  });

  describe("deleteAchievementStageById", () => {
    it("should throw when stage is used by achievements", async () => {
      jest.mocked(getAchievements).mockResolvedValue([{ name: "Achievement 1" }] as any);

      await expect(AchievementStagesService.deleteAchievementStageById("stage-1")).rejects.toThrow(
        "Achievement stage with id(stage-1) is used in achievement(s): [Achievement 1], cannot delete"
      );
    });

    it("should delete the stage when it is not used", async () => {
      jest.mocked(getAchievements).mockResolvedValue([] as any);
      const deleteSpy = jest.spyOn(AchievementStage, "findByIdAndDelete").mockResolvedValue(null as any);

      const result = await AchievementStagesService.deleteAchievementStageById("stage-1");

      expect(deleteSpy).toHaveBeenCalledWith("stage-1");
      expect(result).toEqual({ message: "Successfully removed achievement stage" });
    });
  });

  describe("deleteAchievementSound", () => {
    it("should throw when the sound is used by any stage", async () => {
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([{ name: "Stage 1" }] as never)
      };
      jest.spyOn(AchievementStage, "find").mockReturnValue(queryChain as any);

      await expect(AchievementStagesService.deleteAchievementSound("sound.mp3")).rejects.toThrow(
        "Achievement stage sound  with name: (sound.mp3) is used in ahchievement stage sound(s): [Stage 1], cannot delete"
      );
    });

    it("should delete a sound file when no stage uses it", async () => {
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([] as never)
      };
      jest.spyOn(AchievementStage, "find").mockReturnValue(queryChain as any);
      const unlinkSpy = jest.spyOn(fsPromises, "unlink").mockResolvedValue(undefined as any);

      const result = await AchievementStagesService.deleteAchievementSound("sound.mp3");

      expect(unlinkSpy).toHaveBeenCalledWith(expect.stringContaining("sound.mp3"));
      expect(result).toBe("Achievement stage sound  sound.mp3 deleted successfully");
    });
  });
});

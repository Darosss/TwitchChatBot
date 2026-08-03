/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { TimerModel, TimerCreateData } from "@models";
jest.mock("@models", () => ({
  Timer: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    aggregate: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn()
  }
}));

jest.mock("../aggregations", () => ({
  modesPipeline: [{ $match: { mode: "enabled" } }]
}));

import { Timer } from "@models";
import * as TimersService from "./timers";

const createFakeTimer = () =>
  ({
    _id: "timer-1",
    enabled: true,
    words: ["hello"],
    points: 10,
    reqPoints: 15,
    name: "timer-1",
    delay: 10,
    uses: 2,
    nonFollowMulti: false,
    nonSubMulti: false,
    messages: ["timer message", "timer message 2"],
    description: "Test timer",
    mood: "mood-id",
    tag: "tag-id",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z")
  }) as TimerModel;

describe("Timers Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getTimers", () => {
    it("should query timers with pagination and populate options", async () => {
      const fakeTimers = [createFakeTimer()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeTimers as never)
      };

      const findSpy = jest.spyOn(Timer, "find").mockReturnValue(queryChain as any);

      const result = await TimersService.getTimers(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 }, populate: ["user"] }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalledWith(["user"]);
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeTimers);
    });
  });

  describe("getTimersCount", () => {
    it("should return the count of timers for a filter", async () => {
      const countSpy = jest.spyOn(Timer, "countDocuments").mockResolvedValue(5 as any);

      const result = await TimersService.getTimersCount({ enabled: true });

      expect(countSpy).toHaveBeenCalledWith({ enabled: true });
      expect(result).toBe(5);
    });
  });

  describe("createTimer", () => {
    it("should create a timer and return it", async () => {
      const fakeTimer = createFakeTimer();
      const createSpy = jest.spyOn(Timer, "create").mockResolvedValue(fakeTimer as any);
      const createData: TimerCreateData = {
        messages: ["hello"],
        enabled: true,
        points: 10,
        name: "timmer-1",
        mood: "mood-id",
        tag: "tag-id"
      };

      const result = await TimersService.createTimer(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeTimer);
    });
  });

  describe("updateTimers", () => {
    it("should update many timers with the given filter and data", async () => {
      const updateManySpy = jest.spyOn(Timer, "updateMany").mockResolvedValue({ acknowledged: true } as any);

      const result = await TimersService.updateTimers({ enabled: true }, { enabled: false });

      expect(updateManySpy).toHaveBeenCalledWith({ enabled: true }, { enabled: false });
      expect(result).toEqual({ acknowledged: true });
    });
  });

  describe("updateEnabledTimersAndEnabledModes", () => {
    it("should aggregate timers for enabled updates", async () => {
      const fakeTimers = [createFakeTimer()];
      const aggregateSpy = jest.spyOn(Timer, "aggregate").mockResolvedValue(fakeTimers as any);

      const result = await TimersService.updateEnabledTimersAndEnabledModes(5, { enabled: true });

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual(fakeTimers);
    });
  });

  describe("updateTimerById", () => {
    it("should update a timer and return it", async () => {
      const fakeTimer = createFakeTimer();
      const updateSpy = jest.spyOn(Timer, "findByIdAndUpdate").mockResolvedValue(fakeTimer as any);

      const result = await TimersService.updateTimerById("timer-1", { enabled: false });

      expect(updateSpy).toHaveBeenCalledWith("timer-1", { enabled: false }, { new: true });
      expect(result).toBe(fakeTimer);
    });
  });

  describe("deleteTimerById", () => {
    it("should delete a timer and return it", async () => {
      const fakeTimer = createFakeTimer();
      const deleteSpy = jest.spyOn(Timer, "findByIdAndDelete").mockResolvedValue(fakeTimer as any);

      const result = await TimersService.deleteTimerById("timer-1");

      expect(deleteSpy).toHaveBeenCalledWith("timer-1");
      expect(result).toBe(fakeTimer);
    });
  });

  describe("getTimerById", () => {
    it("should return a timer when one exists", async () => {
      const fakeTimer = createFakeTimer();
      const selectMock = jest.fn().mockReturnThis();
      const populateMock = jest.fn().mockResolvedValue(fakeTimer as never);
      const findByIdSpy = jest
        .spyOn(Timer, "findById")
        .mockReturnValue({ select: selectMock, populate: populateMock } as any);

      const result = await TimersService.getTimerById(
        "timer-1",
        { enabled: 1 },
        { select: { __v: 0 }, populate: ["user"] }
      );

      expect(findByIdSpy).toHaveBeenCalledWith("timer-1", { enabled: 1 });
      expect(selectMock).toHaveBeenCalledWith({ __v: 0 });
      expect(populateMock).toHaveBeenCalledWith(["user"]);
      expect(result).toBe(fakeTimer);
    });
  });

  describe("getOneTimer", () => {
    it("should return the first matching timer", async () => {
      const fakeTimer = createFakeTimer();
      jest.spyOn(Timer, "findOne").mockResolvedValue(fakeTimer as any);

      const result = await TimersService.getOneTimer({ enabled: true });

      expect(result).toBe(fakeTimer);
    });
  });

  describe("getTimersDataWithModesEnabled", () => {
    it("should aggregate timers data for enabled modes", async () => {
      const fakeTimers = [createFakeTimer()];
      const aggregateSpy = jest.spyOn(Timer, "aggregate").mockResolvedValue(fakeTimers as any);

      const result = await TimersService.getTimersDataWithModesEnabled();

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual(fakeTimers);
    });
  });
});

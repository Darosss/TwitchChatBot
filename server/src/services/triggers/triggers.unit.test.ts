/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { TriggerModel, TriggerCreateData } from "@models";
jest.mock("@models", () => ({
  Trigger: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    aggregate: jest.fn()
  }
}));

jest.mock("../aggregations", () => ({
  modesPipeline: [{ $match: { mode: "enabled" } }]
}));

import { Trigger } from "@models";
import * as TriggersService from "./triggers";

const createFakeTrigger = () =>
  ({
    _id: "trigger-1",
    enabled: true,
    words: ["hello"],
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    name: "triggers-1",
    chance: 50,
    delay: 10,
    onDelay: false,
    uses: 2,
    messages: ["trigger message", "trigger message 2"],
    mode: "WholeWord",
    mood: "moodd-id",
    tag: "tag-id"
  }) as TriggerModel;

describe("Triggers Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getTriggers", () => {
    it("should query triggers with pagination and populate options", async () => {
      const fakeTriggers = [createFakeTrigger()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeTriggers as never)
      };

      const findSpy = jest.spyOn(Trigger, "find").mockReturnValue(queryChain as any);

      const result = await TriggersService.getTriggers(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 }, populate: ["user"] }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalledWith(["user"]);
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeTriggers);
    });
  });

  describe("getTriggersCount", () => {
    it("should return the count of triggers for a filter", async () => {
      const countSpy = jest.spyOn(Trigger, "countDocuments").mockResolvedValue(4 as any);

      const result = await TriggersService.getTriggersCount({ enabled: true });

      expect(countSpy).toHaveBeenCalledWith({ enabled: true });
      expect(result).toBe(4);
    });
  });

  describe("createTrigger", () => {
    it("should create a trigger and return it", async () => {
      const fakeTrigger = createFakeTrigger();
      const createSpy = jest.spyOn(Trigger, "create").mockResolvedValue(fakeTrigger as any);
      const createData: TriggerCreateData = {
        name: "triggers-1",
        words: ["hello"],
        enabled: true,
        messages: ["message", "message2"],
        mood: "mood-id",
        tag: "tag-id"
      };

      const result = await TriggersService.createTrigger(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeTrigger);
    });
  });

  describe("updateTriggers", () => {
    it("should update many triggers with the given filter and data", async () => {
      const updateManySpy = jest.spyOn(Trigger, "updateMany").mockResolvedValue({} as any);

      await TriggersService.updateTriggers({ enabled: true }, { enabled: false });

      expect(updateManySpy).toHaveBeenCalledWith({ enabled: true }, { enabled: false });
    });
  });

  describe("updateTriggerById", () => {
    it("should update a trigger and return it", async () => {
      const fakeTrigger = createFakeTrigger();
      const updateSpy = jest.spyOn(Trigger, "findByIdAndUpdate").mockResolvedValue(fakeTrigger as any);

      const result = await TriggersService.updateTriggerById("trigger-1", { enabled: false });

      expect(updateSpy).toHaveBeenCalledWith("trigger-1", { enabled: false }, { new: true });
      expect(result).toBe(fakeTrigger);
    });
  });

  describe("deleteTriggerById", () => {
    it("should delete a trigger and return it", async () => {
      const fakeTrigger = createFakeTrigger();
      const deleteSpy = jest.spyOn(Trigger, "findByIdAndDelete").mockResolvedValue(fakeTrigger as any);

      const result = await TriggersService.deleteTriggerById("trigger-1");

      expect(deleteSpy).toHaveBeenCalledWith("trigger-1");
      expect(result).toBe(fakeTrigger);
    });
  });

  describe("getTriggerById", () => {
    it("should return a trigger when one exists", async () => {
      const fakeTrigger = createFakeTrigger();
      const findByIdSpy = jest.spyOn(Trigger, "findById").mockResolvedValue(fakeTrigger as any);

      const result = await TriggersService.getTriggerById("trigger-1", { enabled: 1 });

      expect(findByIdSpy).toHaveBeenCalledWith("trigger-1", { enabled: 1 });
      expect(result).toBe(fakeTrigger);
    });
  });

  describe("getOneTrigger", () => {
    it("should return the first matching trigger", async () => {
      const fakeTrigger = createFakeTrigger();
      const selectMock = jest.fn().mockReturnThis();
      const populateMock = jest.fn().mockResolvedValue(fakeTrigger as never);
      const findOneSpy = jest
        .spyOn(Trigger, "findOne")
        .mockReturnValue({ select: selectMock, populate: populateMock } as any);

      const result = await TriggersService.getOneTrigger({ enabled: true }, { populate: ["user"], select: { __v: 0 } });

      expect(findOneSpy).toHaveBeenCalledWith({ enabled: true });
      expect(selectMock).toHaveBeenCalledWith({ __v: 0 });
      expect(populateMock).toHaveBeenCalledWith(["user"]);
      expect(result).toBe(fakeTrigger);
    });
  });

  describe("getTriggersWords", () => {
    it("should aggregate and sort trigger words by length", async () => {
      const aggregateSpy = jest.spyOn(Trigger, "aggregate").mockResolvedValue([{ words: ["hello", "hi"] }] as any);

      const result = await TriggersService.getTriggersWords(false);

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual(["hello", "hi"]);
    });
  });
});

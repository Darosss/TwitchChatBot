/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  Affix: {
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

jest.mock("@services", () => ({
  getChatCommandsCount: jest.fn(),
  getMessageCategoriesCount: jest.fn(),
  getTimersCount: jest.fn(),
  getTriggersCount: jest.fn()
}));

import { Affix } from "@models";
import { getChatCommandsCount, getMessageCategoriesCount, getTimersCount, getTriggersCount } from "@services";
import * as AffixesService from "./affixes";

const createFakeAffix = () => ({
  _id: "affix-1",
  name: "Test Affix",
  enabled: true,
  prefixes: ["pre"],
  suffixes: ["suf"],
  prefixChance: 20,
  suffixChance: 30,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});

describe("Affixes Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAffixes", () => {
    it("should query affixes with pagination and return the result", async () => {
      const fakeAffixes = [createFakeAffix()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeAffixes as never)
      };

      const findSpy = jest.spyOn(Affix, "find").mockReturnValue(queryChain as any);

      const result = await AffixesService.getAffixes(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeAffixes);
    });
  });

  describe("getAffixesCount", () => {
    it("should return the count of affixes for a filter", async () => {
      const countSpy = jest.spyOn(Affix, "countDocuments").mockResolvedValue(4 as any);

      const result = await AffixesService.getAffixesCount({ enabled: true });

      expect(countSpy).toHaveBeenCalledWith({ enabled: true });
      expect(result).toBe(4);
    });
  });

  describe("createAffix", () => {
    it("should create an affix and return it", async () => {
      const fakeAffix = createFakeAffix();
      const createSpy = jest.spyOn(Affix, "create").mockResolvedValue(fakeAffix as any);
      const createData = { name: "Test Affix", enabled: true, prefixes: ["pre"], suffixes: ["suf"] };

      const result = await AffixesService.createAffix(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeAffix);
    });
  });

  describe("updateAffixes", () => {
    it("should update many affixes with the given filter and data", async () => {
      const updateManySpy = jest.spyOn(Affix, "updateMany").mockResolvedValue({} as any);

      await AffixesService.updateAffixes({ enabled: true }, { enabled: false });

      expect(updateManySpy).toHaveBeenCalledWith({ enabled: true }, { enabled: false });
    });
  });

  describe("updateAffixById", () => {
    it("should update an affix and return it", async () => {
      const fakeAffix = createFakeAffix();
      const updateSpy = jest.spyOn(Affix, "findByIdAndUpdate").mockResolvedValue(fakeAffix as any);

      const result = await AffixesService.updateAffixById("affix-1", { enabled: false });

      expect(updateSpy).toHaveBeenCalledWith("affix-1", { enabled: false }, { new: true });
      expect(result).toBe(fakeAffix);
    });
  });

  describe("deleteAffixById", () => {
    it("should delete an affix when it is not used elsewhere", async () => {
      const fakeAffix = createFakeAffix();
      const deleteSpy = jest.spyOn(Affix, "findByIdAndDelete").mockResolvedValue(fakeAffix as any);
      jest.mocked(getTriggersCount).mockResolvedValue(0 as any);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0 as any);
      jest.mocked(getTimersCount).mockResolvedValue(0 as any);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0 as any);

      const result = await AffixesService.deleteAffixById("affix-1");

      expect(deleteSpy).toHaveBeenCalledWith("affix-1");
      expect(result).toBe(fakeAffix);
    });

    it("should throw when the affix is used by another document", async () => {
      jest.mocked(getTriggersCount).mockResolvedValue(1 as any);
      jest.mocked(getChatCommandsCount).mockResolvedValue(0 as any);
      jest.mocked(getTimersCount).mockResolvedValue(0 as any);
      jest.mocked(getMessageCategoriesCount).mockResolvedValue(0 as any);

      await expect(AffixesService.deleteAffixById("affix-1")).rejects.toThrow();
    });
  });

  describe("getAffixById", () => {
    it("should return an affix when one exists", async () => {
      const fakeAffix = createFakeAffix();
      const findByIdSpy = jest.spyOn(Affix, "findById").mockResolvedValue(fakeAffix as any);

      const result = await AffixesService.getAffixById("affix-1", { enabled: 1 });

      expect(findByIdSpy).toHaveBeenCalledWith("affix-1", { enabled: 1 });
      expect(result).toBe(fakeAffix);
    });
  });

  describe("getOneAffix", () => {
    it("should return the first matching affix", async () => {
      const fakeAffix = createFakeAffix();
      jest.spyOn(Affix, "findOne").mockResolvedValue(fakeAffix as any);

      const result = await AffixesService.getOneAffix({ enabled: true });

      expect(result).toBe(fakeAffix);
    });
  });

  describe("getEnabledSuffixesAndPrefixes", () => {
    it("should aggregate and deduplicate enabled suffixes and prefixes", async () => {
      const aggregateSpy = jest
        .spyOn(Affix, "aggregate")
        .mockResolvedValue([{ prefixes: [["pre1", "pre2"]], suffixes: [["suf1", "suf2"]] }] as any);

      const result = await AffixesService.getEnabledSuffixesAndPrefixes();

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual({ prefixes: ["pre1", "pre2"], suffixes: ["suf1", "suf2"] });
    });
  });

  describe("getMultiperEnabledAfixesChances", () => {
    it("should aggregate multiplier values for enabled affixes", async () => {
      const aggregateSpy = jest
        .spyOn(Affix, "aggregate")
        .mockResolvedValue([{ prefixesMultipler: 200, suffixesMultipler: 300 }] as any);

      const result = await AffixesService.getMultiperEnabledAfixesChances();

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual({ prefixesMultipler: 2, suffixesMultipler: 3 });
    });
  });

  describe("getAverageEnabledAffixesChances", () => {
    it("should aggregate average chances for enabled affixes", async () => {
      const aggregateSpy = jest
        .spyOn(Affix, "aggregate")
        .mockResolvedValue([{ prefixesChances: 20, suffixesChances: 30 }] as any);

      const result = await AffixesService.getAverageEnabledAffixesChances();

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual({ prefixesChances: 20, suffixesChances: 30 });
    });
  });
});

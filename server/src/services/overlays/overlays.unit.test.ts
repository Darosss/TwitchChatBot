/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Overlay } from "@models";
import * as OverlaysService from "./overlays";

const createFakeOverlay = () => ({
  _id: "overlay-1",
  name: "Test Overlay",
  layout: {},
  toolbox: {},
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});

describe("Overlays Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getOverlays", () => {
    it("should query overlays with pagination and return the result", async () => {
      const fakeOverlays = [createFakeOverlay()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeOverlays as never)
      };

      const findSpy = jest.spyOn(Overlay, "find").mockReturnValue(queryChain as any);

      const result = await OverlaysService.getOverlays(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeOverlays);
    });
  });

  describe("getOverlaysCount", () => {
    it("should return the count of overlays for a filter", async () => {
      const countSpy = jest.spyOn(Overlay, "countDocuments").mockResolvedValue(3 as any);

      const result = await OverlaysService.getOverlaysCount({ name: "Test Overlay" });

      expect(countSpy).toHaveBeenCalledWith({ name: "Test Overlay" });
      expect(result).toBe(3);
    });
  });

  describe("createOverlay", () => {
    it("should create an overlay and return the created document", async () => {
      const fakeOverlay = createFakeOverlay();
      const createSpy = jest.spyOn(Overlay, "create").mockResolvedValue(fakeOverlay as any);
      const createData = { name: "Test Overlay", layout: {}, toolbox: {} };

      const result = await OverlaysService.createOverlay(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeOverlay);
    });
  });

  describe("getOverlayById", () => {
    it("should return an overlay when it exists", async () => {
      const fakeOverlay = createFakeOverlay();
      const selectMock = jest.fn().mockResolvedValue(fakeOverlay as never);
      const findByIdSpy = jest.spyOn(Overlay, "findById").mockReturnValue({ select: selectMock } as any);

      const result = await OverlaysService.getOverlayById("overlay-1", { select: { __v: 0 } });

      expect(findByIdSpy).toHaveBeenCalledWith("overlay-1");
      expect(selectMock).toHaveBeenCalledWith({ __v: 0 });
      expect(result).toBe(fakeOverlay);
    });

    it("should throw when the overlay is not found", async () => {
      jest.spyOn(Overlay, "findById").mockReturnValue({ select: jest.fn().mockResolvedValue(null as never) } as any);

      await expect(OverlaysService.getOverlayById("missing-overlay", { select: { __v: 0 } })).rejects.toThrow();
    });
  });

  describe("updateOverlayById", () => {
    it("should update an overlay and return the updated document", async () => {
      const fakeOverlay = createFakeOverlay();
      const updateSpy = jest.spyOn(Overlay, "findByIdAndUpdate").mockResolvedValue(fakeOverlay as any);

      const result = await OverlaysService.updateOverlayById("overlay-1", { name: "Updated Overlay" });

      expect(updateSpy).toHaveBeenCalledWith("overlay-1", { name: "Updated Overlay" }, { new: true });
      expect(result).toBe(fakeOverlay);
    });
  });

  describe("deleteOverlayById", () => {
    it("should delete an overlay and return the deleted document", async () => {
      const fakeOverlay = createFakeOverlay();
      const deleteSpy = jest.spyOn(Overlay, "findByIdAndDelete").mockResolvedValue(fakeOverlay as any);

      const result = await OverlaysService.deleteOverlayById("overlay-1");

      expect(deleteSpy).toHaveBeenCalledWith("overlay-1");
      expect(result).toBe(fakeOverlay);
    });
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Widgets } from "@models";
import * as WidgetsService from "./widgets";

const createFakeWidget = () => ({
  _id: "widget-1",
  name: "Test Widget",
  layout: {},
  toolbox: {},
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z")
});

describe("Widgets Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getWidgets", () => {
    it("should query widgets with pagination and return the result", async () => {
      const fakeWidgets = [createFakeWidget()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeWidgets as never)
      };

      const findSpy = jest.spyOn(Widgets, "find").mockReturnValue(queryChain as any);

      const result = await WidgetsService.getWidgets(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeWidgets);
    });
  });

  describe("getWidgetsCount", () => {
    it("should return the count of widgets for a filter", async () => {
      const countSpy = jest.spyOn(Widgets, "countDocuments").mockResolvedValue(3 as any);

      const result = await WidgetsService.getWidgetsCount({ name: "Test Widget" });

      expect(countSpy).toHaveBeenCalledWith({ name: "Test Widget" });
      expect(result).toBe(3);
    });
  });

  describe("createWidget", () => {
    it("should create a widget and return the created document", async () => {
      const fakeWidget = createFakeWidget();
      const createSpy = jest.spyOn(Widgets, "create").mockResolvedValue(fakeWidget as any);
      const createData = { name: "Test Widget", layout: {}, toolbox: {} };

      const result = await WidgetsService.createWidget(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeWidget);
    });
  });

  describe("getWidgetById", () => {
    it("should return a widget when it exists", async () => {
      const fakeWidget = createFakeWidget();
      const selectMock = jest.fn().mockResolvedValue(fakeWidget as never);
      const findByIdSpy = jest.spyOn(Widgets, "findById").mockReturnValue({ select: selectMock } as any);

      const result = await WidgetsService.getWidgetById("widget-1", { select: { __v: 0 } });

      expect(findByIdSpy).toHaveBeenCalledWith("widget-1");
      expect(selectMock).toHaveBeenCalledWith({ __v: 0 });
      expect(result).toBe(fakeWidget);
    });

    it("should throw when the widget is not found", async () => {
      jest.spyOn(Widgets, "findById").mockReturnValue({ select: jest.fn().mockResolvedValue(null as never) } as any);

      await expect(WidgetsService.getWidgetById("missing-widget", { select: { __v: 0 } })).rejects.toThrow();
    });
  });

  describe("updateWidgetById", () => {
    it("should update a widget and return the updated document", async () => {
      const fakeWidget = createFakeWidget();
      const updateSpy = jest.spyOn(Widgets, "findByIdAndUpdate").mockResolvedValue(fakeWidget as any);

      const result = await WidgetsService.updateWidgetById("widget-1", { name: "Updated Widget" });

      expect(updateSpy).toHaveBeenCalledWith("widget-1", { name: "Updated Widget" }, { new: true });
      expect(result).toBe(fakeWidget);
    });
  });

  describe("deleteWidgetById", () => {
    it("should delete a widget and return the deleted document", async () => {
      const fakeWidget = createFakeWidget();
      const deleteSpy = jest.spyOn(Widgets, "findByIdAndDelete").mockResolvedValue(fakeWidget as any);

      const result = await WidgetsService.deleteWidgetById("widget-1");

      expect(deleteSpy).toHaveBeenCalledWith("widget-1");
      expect(result).toBe(fakeWidget);
    });
  });
});

import { Widgets } from "@models/widgetsModel";
import { WidgetsDocument } from "@models/types";
import { checkExistResource } from "@utils/checkExistResourceUtil";
import { AppError, handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  WidgetCreateData,
  WidgetsFindOptions,
  WidgetUpdateData,
  ManyWidgetsFindOptions,
} from "./types/";

export const getWidgets = async (
  filter: FilterQuery<WidgetsDocument> = {},
  widgetFindOptions: ManyWidgetsFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = { createdAt: -1 },
    select = { __v: 0 },
  } = widgetFindOptions;

  try {
    const widget = await Widgets.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return widget;
  } catch (err) {
    logger.error(`Error occured while getting widgets: ${err}`);
    throw new AppError(500);
  }
};

export const getWidgetsCount = async (
  filter: FilterQuery<WidgetsDocument> = {}
) => {
  return await Widgets.countDocuments(filter);
};

export const createWidget = async (
  createData: WidgetCreateData | WidgetCreateData[]
) => {
  try {
    const createdWidget = await Widgets.create(createData);
    if (!createdWidget) {
      throw new AppError(400, "Couldn't create widget");
    }

    return createdWidget;
  } catch (err) {
    logger.error(`Error occured while creating widgets: ${err}`);
    handleAppError(err);
  }
};

export const getWidgetById = async (
  id: string,
  widgetFindOptions: WidgetsFindOptions
) => {
  const { select = { __v: 0 } } = widgetFindOptions;

  try {
    const foundWidget = await Widgets.findById(id).select(select);

    const widget = checkExistResource(foundWidget, `Widget with id(${id})`);

    return widget;
  } catch (err) {
    logger.error(`Error occured while getting widgetwith id(${id}): ${err}`);
    handleAppError(err);
  }
};

export const updateWidgetById = async (
  id: string,
  updateData: UpdateQuery<WidgetUpdateData>
) => {
  try {
    const updatedWidget = await Widgets.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    const widget = checkExistResource(updatedWidget, `Widget with id(${id})`);

    return widget;
  } catch (err) {
    logger.error(`Error occured while editing widgetwith id(${id}): ${err}`);
    handleAppError(err);
  }
};

export const deleteWidgetById = async (id: string) => {
  try {
    const deletedWidget = await Widgets.findByIdAndDelete(id);

    const widget = checkExistResource(deletedWidget, `Widget with id(${id})`);

    return widget;
  } catch (err) {
    logger.error(`Error occured while deleting widgetwith id(${id}) : ${err}`);
    handleAppError(err);
  }
};

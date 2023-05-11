import Express, { NextFunction, Request, Response } from "express";
import {
  createWidget,
  deleteWidgetById,
  getWidgetById as getWidgetByIdService,
  getWidgets,
  getWidgetsCount,
  updateWidgetById,
  WidgetCreateData,
  WidgetUpdateData,
} from "@services/widgets";
import { RequestParams, RequestSearch } from "@types";
import { WidgetsModel } from "@models/types";

export const getWidgetsList = async (
  req: Request<{}, {}, {}, RequestSearch<WidgetsModel>>,
  res: Response,
  next: NextFunction
) => {
  const {
    page = "1",
    limit = "25",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const searchFilter = {};
  try {
    const widgets = await getWidgets(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
    });

    const count = await getWidgetsCount(searchFilter);
    return res.status(200).send({
      data: widgets,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const getWidgetById = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const widget = await getWidgetByIdService(id, {});

    return res.status(200).send({
      data: widget,
    });
  } catch (err) {
    next(err);
  }
};

export const addNewWidget = async (
  req: Request<RequestParams, {}, WidgetCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { name, layout, toolbox } = req.body;
  try {
    const newWidget = await createWidget({
      name: name,
      layout: layout,
      toolbox: toolbox,
    });

    return res
      .status(201)
      .send({ message: "Added successfully", widget: newWidget });
  } catch (err) {
    next(err);
  }
};

export const editWidgetById = async (
  req: Request<RequestParams, {}, WidgetUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, layout, toolbox } = req.body;
  try {
    const updatedWidget = await updateWidgetById(id, {
      name: name,
      layout: layout,
      toolbox: toolbox,
    });

    return res.status(200).send({
      message: "Updated successfully",
      widget: updatedWidget,
    });
  } catch (err) {
    next(err);
  }
};

export const removeWidgetById = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedWidget = await deleteWidgetById(id);

    return res.status(200).send({ message: "Widget deleted successfully" });
  } catch (err) {
    next(err);
  }
};

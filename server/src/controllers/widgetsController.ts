import Express, { NextFunction, Request, Response } from "express";
import {
  createWidget,
  deleteWidgetById,
  getWidgetById as getWidgetByIdService,
  getWidgets,
  getWidgetsCount,
  updateWidgetById,
} from "@services/widgets";

export const getWidgetsList = async (
  req: Request<{}, {}, {}, any>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 25 } = req.query;

  const searchFilter = {}; // filterCommandsByUrlParams(req.query);
  try {
    const widgets = await getWidgets(searchFilter, {
      limit: limit,
      skip: page,
      sort: { createdAt: -1 },
    });

    const count = await getWidgetsCount(searchFilter);
    return res.status(200).send({
      data: widgets,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const getWidgetById = async (
  req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, layout } = req.body;
  try {
    const newWidget = await createWidget({
      name: name,
      layout: layout,
    });

    return res
      .status(201)
      .send({ message: "Added successfully", widget: newWidget });
  } catch (err) {
    next(err);
  }
};

export const editWidgetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, description, enabled, aliases, messages, privilege } = req.body;

  try {
    const updatedWidget = await updateWidgetById(id, {
      name: name,
      description: description,
      enabled: enabled,
      aliases: aliases,
      messages: messages,
      privilege: privilege,
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
  req: Request,
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

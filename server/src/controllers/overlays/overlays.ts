import { NextFunction, Request, Response } from "express";
import {
  createOverlay,
  deleteOverlayById,
  getOverlayById as getOverlayByIdService,
  getOverlays,
  getOverlaysCount,
  updateOverlayById,
  OverlayCreateData,
  OverlayUpdateData
} from "@services";
import { RequestParams, RequestSearch } from "../types";

export const getOverlaysList = async (req: Request<{}, {}, {}, RequestSearch>, res: Response, next: NextFunction) => {
  const { page = 1, limit = 25 } = req.query;

  const searchFilter = {}; // filterCommandsByUrlParams(req.query);
  try {
    const overlays = await getOverlays(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { createdAt: -1 }
    });

    const count = await getOverlaysCount(searchFilter);
    return res.status(200).send({
      data: overlays,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const getOverlayById = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const overlay = await getOverlayByIdService(id, {});

    return res.status(200).send({
      data: overlay
    });
  } catch (err) {
    next(err);
  }
};

export const addNewOverlay = async (
  req: Request<RequestParams, {}, OverlayCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { name, layout, toolbox } = req.body;

  const createData = { name, layout, toolbox };
  try {
    const newOverlay = await createOverlay(createData);

    return res.status(201).send({ message: "Overlay added successfully", data: newOverlay });
  } catch (err) {
    next(err);
  }
};

export const editOverlayById = async (
  req: Request<RequestParams, {}, OverlayUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, layout, toolbox, styles } = req.body;

  const updateData = { name, layout, toolbox, styles };
  try {
    const updatedOverlay = await updateOverlayById(id, updateData);

    return res.status(200).send({
      message: "Overlay updated successfully",
      data: updatedOverlay
    });
  } catch (err) {
    next(err);
  }
};

export const removeOverlayById = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await deleteOverlayById(id);

    return res.status(200).send({ message: "Overlay deleted successfully" });
  } catch (err) {
    next(err);
  }
};

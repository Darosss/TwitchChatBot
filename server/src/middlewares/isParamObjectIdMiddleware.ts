import { AppError } from "@utils";
import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

const isParamObjectId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (isObjectIdOrHexString(id)) return next();
  else throw new AppError(400, "Id param isn't Object Id");
};

export default isParamObjectId;

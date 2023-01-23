import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

const isParamObjectId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (isObjectIdOrHexString(id)) return next();
  else res.status(400).send({ message: "Id isn't a ObjectId" });
};

export default isParamObjectId;

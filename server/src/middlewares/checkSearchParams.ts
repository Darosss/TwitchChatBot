import { RequestQuery } from "@types";
import { NextFunction, Request, Response } from "express";

export const checkSearchParams = (req: Request<{}, {}, {}, RequestQuery>, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;

  if ((page && limit && Number(page) > 0 && Number(limit) > 0) || (page === undefined && limit === undefined))
    return next();

  req.query.page = "1";
  req.query.limit = "20";
  return next();
};

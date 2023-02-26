import { IRequestQuery } from "@types";
import { AppError } from "@utils/ErrorHandler.util";
import { NextFunction, Request, Response } from "express";

const checkSearchParams = (
  req: Request<{}, {}, {}, IRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = req.query;
  let message = ``;

  if (
    (page && limit && page > 0 && limit > 0) ||
    (page === undefined && limit === undefined)
  )
    return next();

  if (Number(page) <= 0) message += `Page key must be > 0;`;
  if (Number(limit) <= 0) message += `Limit key must be > 0;`;

  if (message.length < 1) message = "Probably page or limit aren't numbers";

  throw new AppError(400, message);
};

export default checkSearchParams;

import { IRequestQuery } from "@types";
import { NextFunction, Request, Response } from "express";

const checkSearchParams = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query as unknown as IRequestQuery;

  let message = ``;

  if ((page >= 0 && limit > 0) || page === undefined || limit === undefined)
    return next();

  if (page < 0) message += `Page key must be >= 0;`;
  if (limit <= 0) message += `Limit key must be > 0;`;

  if (message.length < 1) message = "Probably page or limit aren't numbers";

  res.status(400).send({
    message: message,
  });
};

export default checkSearchParams;

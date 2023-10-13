import { AppError } from "@utils";
import { NextFunction, Request, Response } from "express";

export const errorResponder = (error: AppError, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 400;
  res.status(status).send({ message: error.message, status: status });
};

export const invalidPathHandler = (req: Request, res: Response, next: NextFunction) => {
  const statusCode = 404;

  res.statusCode = statusCode;
  res.send({ message: "Invalid path", status: statusCode });
};

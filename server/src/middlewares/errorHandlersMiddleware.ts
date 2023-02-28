import { AppError } from "@utils/ErrorHandler.util";
import { Request, Response, NextFunction } from "express";

export const errorResponder = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header("Content-Type", "application/json");

  const status = error.statusCode || 400;
  res.status(status).send({ message: error.message, status: status });
};

export const invalidPathHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 404;

  res.status(statusCode);
  res.send({ message: "Invalid path", status: statusCode });
};

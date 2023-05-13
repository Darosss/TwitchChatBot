import { AppError } from "@utils/ErrorHandlerUtil";
import { Request, Response } from "express";

export const errorResponder = (error: AppError, req: Request, res: Response) => {
  res.header("Content-Type", "application/json");

  const status = error.statusCode || 400;
  res.status(status).send({ message: error.message, status: status });
};

export const invalidPathHandler = (req: Request, res: Response) => {
  const statusCode = 404;

  res.status(statusCode);
  res.send({ message: "Invalid path", status: statusCode });
};

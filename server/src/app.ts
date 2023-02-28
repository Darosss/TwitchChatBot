import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import initRoutes from "./routes";
import localSocket from "./socketIO";
import http from "http";
import {
  errorResponder,
  invalidPathHandler,
} from "@middlewares/errorHandlersMiddleware";

const expressApp = () => {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());

  app.set("json spaces", 2);
  app.use(cors({ origin: "*", methods: ["POST", "GET", "DELETE"] }));
  app.use(express.urlencoded({ extended: true }));

  const localSocketIO = localSocket(server);

  app.use((req: Request, res: Response, next: NextFunction) => {
    req.io = localSocketIO;

    return next();
  });

  initRoutes(app);

  app.use(errorResponder);

  app.use(invalidPathHandler);

  return server;
};

export default expressApp;

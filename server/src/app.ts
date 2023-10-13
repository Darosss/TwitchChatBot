import express, { NextFunction, Request, RequestHandler, Response } from "express";
import cors from "cors";
import initRoutes from "./routes";
import localSocket from "./socketIO";
import http from "http";
import { errorResponder, invalidPathHandler } from "@middlewares/errorHandlersMiddleware";
import twitchHandlersMiddleware from "@middlewares/twitchHandlersMiddleware";
import { hostFrontendURL, localFrontendURL } from "@configs";

const expressApp = () => {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());
  app.set("json spaces", 2);
  app.use(
    cors({
      origin: [hostFrontendURL, localFrontendURL],
      methods: ["POST", "GET", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
      credentials: true
    })
  );
  app.use(express.urlencoded({ extended: true }));

  const localSocketIO = localSocket(server);
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.io = localSocketIO;
    return next();
  });
  app.use(runOnceMiddleware(twitchHandlersMiddleware));

  initRoutes(app);

  app.use(errorResponder);
  app.use(invalidPathHandler);
  return server;
};

function runOnceMiddleware(middleware: RequestHandler): RequestHandler {
  let hasRun = false;

  return function (req: Request, res: Response, next: NextFunction) {
    if (!hasRun) {
      middleware(req, res, next);
      hasRun = true;
    } else {
      next();
    }
  };
}

export default expressApp;

import "module-alias/register";
import express from "express";
import cors from "cors";
import initRoutes from "./routes";
import localSocket from "./local-socket";
import { NextFunction, Request, Response } from "express";

import http from "http";

const expressApp = () => {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());

  app.set("json spaces", 2);
  app.use(cors({ origin: "*", methods: ["POST", "GET"] }));
  app.use(express.urlencoded({ extended: true }));

  const localSocketIO = localSocket(server);

  app.use((req: Request, res: Response, next: NextFunction) => {
    req.io = localSocketIO;

    return next();
  });

  initRoutes(app);

  return server;
};

export default expressApp;

import express from "express";
import cors from "cors";
import { initRoutes } from "./routes";
import http from "http";
import { errorResponder, invalidPathHandler } from "@middlewares";
import { hostFrontendURL, localFrontendURL } from "@configs";
import path from "path";
import { SocketHandler } from "@socket";

const expressApp = () => {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));
  app.set("json spaces", 2);
  app.use(
    cors({
      origin: [hostFrontendURL, localFrontendURL],
      methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
      credentials: true
    })
  );
  app.use(express.urlencoded({ extended: true }));
  SocketHandler.getInstance(server);

  initRoutes(app);

  app.use(errorResponder);
  app.use(invalidPathHandler);
  return server;
};

export default expressApp;

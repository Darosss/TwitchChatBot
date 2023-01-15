import express from "express";
import cors from "cors";
import initRoutes from "./routes";

const expressApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: "*", methods: ["POST", "GET"] }));

  initRoutes(app);

  return app;
};

export default expressApp;

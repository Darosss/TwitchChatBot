import Express, { Router } from "express";
import { getConfigsList, editConfigs } from "@controllers/configsController";

const configsRouter = Router();

configsRouter.get("/", getConfigsList);
configsRouter.post("/edit", editConfigs);

export default configsRouter;

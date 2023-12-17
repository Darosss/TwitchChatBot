import { Router } from "express";
import { getConfigsList, editConfigs, resetConfigsToDefaults } from "@controllers";

const configsRouter = Router();

configsRouter.get("/", getConfigsList);
configsRouter.post("/edit", editConfigs);
configsRouter.post("/defaults", resetConfigsToDefaults);

export default configsRouter;

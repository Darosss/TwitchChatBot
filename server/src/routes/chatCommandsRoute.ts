import { Router } from "express";
import { getChatCommandsList, addNewCommand, editChatCommandById, deleteCommandById } from "@controllers";
import { checkSearchParams, isParamObjectId } from "@middlewares";

const chatCommandsRouter = Router();

chatCommandsRouter.get("/", checkSearchParams, getChatCommandsList);
chatCommandsRouter.post("/create", addNewCommand);
chatCommandsRouter.post("/:id", isParamObjectId, editChatCommandById);
chatCommandsRouter.delete("/delete/:id", isParamObjectId, deleteCommandById);

export default chatCommandsRouter;

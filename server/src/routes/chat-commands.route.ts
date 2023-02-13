import Express, { Router } from "express";
import isParamObjectId from "@middlewares/isParamObjectId.middleware";
import {
  getChatCommandsList,
  addNewCommand,
  editChatCommandById,
  deleteCommandById,
} from "@controllers/chat-commands.controller";
import checkSearchParams from "@middlewares/checkSearchParams.middleware";

const chatCommandsRouter = Router();

chatCommandsRouter.get("/", checkSearchParams, getChatCommandsList);
chatCommandsRouter.post("/create", addNewCommand);
chatCommandsRouter.post("/:id", isParamObjectId, editChatCommandById);
chatCommandsRouter.delete("/delete/:id", isParamObjectId, deleteCommandById);

export default chatCommandsRouter;

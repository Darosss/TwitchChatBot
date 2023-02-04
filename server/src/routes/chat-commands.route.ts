import Express, { Router } from "express";
import isParamObjectId from "@middlewares/isParamObjectId.middleware";
import {
  getChatCommands,
  addNewCommand,
  editChatCommand,
  deleteChatCommand,
} from "@controllers/chat-commands.controller";
import checkSearchParams from "@middlewares/checkSearchParams.middleware";

const chatCommandsRouter = Router();

chatCommandsRouter.get("/", checkSearchParams, getChatCommands);
chatCommandsRouter.post("/create", addNewCommand);
chatCommandsRouter.post("/:id", isParamObjectId, editChatCommand);
chatCommandsRouter.delete("/delete/:id", isParamObjectId, deleteChatCommand);

export default chatCommandsRouter;

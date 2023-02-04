import Express, { Router } from "express";
import isParamObjectId from "@middlewares/isParamObjectId.middleware";
import {
  getChatCommands,
  addNewCommand,
  editChatCommand,
  deleteChatCommand,
} from "@controllers/chat-commands.controller";

const chatCommandsRouter = Router();

chatCommandsRouter.get("/", getChatCommands);
chatCommandsRouter.post("/create", addNewCommand);
chatCommandsRouter.post("/:id", isParamObjectId, editChatCommand);
chatCommandsRouter.delete("/delete/:id", isParamObjectId, deleteChatCommand);

export default chatCommandsRouter;

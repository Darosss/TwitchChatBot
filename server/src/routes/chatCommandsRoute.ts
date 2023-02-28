import Express, { Router } from "express";
import {
  getChatCommandsList,
  addNewCommand,
  editChatCommandById,
  deleteCommandById,
} from "@controllers/chatCommandsController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";
import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";

const chatCommandsRouter = Router();

chatCommandsRouter.get("/", checkSearchParams, getChatCommandsList);
chatCommandsRouter.post("/create", addNewCommand);
chatCommandsRouter.post("/:id", isParamObjectId, editChatCommandById);
chatCommandsRouter.delete("/delete/:id", isParamObjectId, deleteCommandById);

export default chatCommandsRouter;

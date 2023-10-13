import { Router } from "express";
import { getMessagesList } from "@controllers";
import { checkSearchParams } from "@middlewares";

const messagesRouter = Router();

messagesRouter.get("/", checkSearchParams, getMessagesList);

export default messagesRouter;

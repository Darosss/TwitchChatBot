import { Router } from "express";
import { getMessagesList } from "@controllers/messagesController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";

const messagesRouter = Router();

messagesRouter.get("/", checkSearchParams, getMessagesList);

export default messagesRouter;

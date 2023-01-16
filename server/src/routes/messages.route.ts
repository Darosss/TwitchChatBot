import Express, { Router } from "express";
import { getMessages } from "../controllers/messages.controller";

const messagesRouter = Router();

messagesRouter.get("/", getMessages);

export default messagesRouter;

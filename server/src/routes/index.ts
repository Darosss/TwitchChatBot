import express, { Express } from "express";
import auth from "./authRoute";
import chatCommandsRouter from "./chatCommandsRoute";
import configsRouter from "./configsRoute";
import messagesRouter from "./messagesRoute";
import redemptionsRouter from "./redemptionsRoute";
import triggersRouter from "./triggersRoute";
import timersRouter from "./timersRoute";
import usersRouter from "./usersRoute";
import streamSessionsRouter from "./streamSessionsRoute";
import messageCategoriesRouter from "./messageCategoriesRoute";
import overlayRouter from "./overlayRoute";
import widgetsRouter from "./widgetsRoute";
import moodsRouter from "./moodsRoute";
import tagsRouter from "./tagsRoute";
import affixesRouter from "./affixesRoute";
import filesRouter from "./filesRoute";

const initRoutes = (app: Express) => {
  app.use("/auth", auth);
  app.use("/chat-commands", chatCommandsRouter);
  app.use("/configs", configsRouter);
  app.use("/messages", messagesRouter);
  app.use("/message-categories", messageCategoriesRouter);
  app.use("/moods", moodsRouter);
  app.use("/overlays", overlayRouter);
  app.use("/users", usersRouter);
  app.use("/affixes", affixesRouter);
  app.use("/redemptions", redemptionsRouter);
  app.use("/stream-sessions", streamSessionsRouter);
  app.use("/tags", tagsRouter);
  app.use("/triggers", triggersRouter);
  app.use("/timers", timersRouter);
  app.use("/files", filesRouter);
  app.use("/widgets", widgetsRouter);
};

export default initRoutes;

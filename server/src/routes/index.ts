import auth from "./authRoute";
import chatCommandsRouter from "./chatCommandsRoute";
import configsRouter from "./configsRoute";
import messagesRouter from "./messagesRoute";
import redemptionsRouter from "./redemptionsRoute";
import triggersRouter from "./triggersRoute";
import usersRouter from "./usersRoute";
import streamSessionsRouter from "./streamSessionsRoute";
import messageCategoriesRouter from "./messageCategoriesRoute";
import overlayRouter from "./overlayRoute";
import widgetsRouter from "./widgetsRoute";

const initRoutes = (app: any) => {
  app.use("/auth", auth);
  app.use("/chat-commands", chatCommandsRouter);
  app.use("/configs", configsRouter);
  app.use("/messages", messagesRouter);
  app.use("/message-categories", messageCategoriesRouter);
  app.use("/overlays", overlayRouter);
  app.use("/users", usersRouter);
  app.use("/redemptions", redemptionsRouter);
  app.use("/stream-sessions", streamSessionsRouter);
  app.use("/triggers", triggersRouter);
  app.use("/widgets", widgetsRouter);
};

export default initRoutes;

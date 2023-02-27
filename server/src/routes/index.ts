import auth from "./auth.route";
import messagesRouter from "./messages.route";
import usersRouter from "./users.route";
import streamSessionsRouter from "./streamSessions.route";
import redemptionsRouter from "./redemptions.route";
import chatCommandsRouter from "./chat-commands.route";
import configsRouter from "./configs.route";
import triggersRouter from "./triggers.route";

const initRoutes = (app: any) => {
  app.use("/auth", auth);
  app.use("/chat-commands", chatCommandsRouter);
  app.use("/configs", configsRouter);
  app.use("/messages", messagesRouter);
  app.use("/users", usersRouter);
  app.use("/redemptions", redemptionsRouter);
  app.use("/stream-sessions", streamSessionsRouter);
  app.use("/triggers", triggersRouter);
};

export default initRoutes;

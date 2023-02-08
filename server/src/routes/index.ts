import auth from "./auth.route";
import messagesRouter from "./messages.route";
import usersRouter from "./users.route";
import twitchSessionRouter from "./twitch-session.route";
import redemptionsRouter from "./redemptions.route";
import chatCommandsRouter from "./chat-commands.route";
import configsRouter from "./configs.route";

const initRoutes = (app: any) => {
  app.use("/auth", auth);
  app.use("/users", usersRouter);
  app.use("/messages", messagesRouter);
  app.use("/twitch-sessions", twitchSessionRouter);
  app.use("/redemptions", redemptionsRouter);
  app.use("/chat-commands", chatCommandsRouter);
  app.use("/configs", configsRouter);
};

export default initRoutes;

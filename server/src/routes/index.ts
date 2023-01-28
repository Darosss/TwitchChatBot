import overlayRouter from "./overlay.route";
import messagesRouter from "./messages.route";
import usersRouter from "./users.route";
import twitchSessionRouter from "./twitch-session.route";
import redemptionsRouter from "./redemptions.route";

const initRoutes = (app: any) => {
  app.use("/", overlayRouter);
  app.use("/users", usersRouter);
  app.use("/messages", messagesRouter);
  app.use("/twitch-sessions", twitchSessionRouter);
  app.use("/redemptions", redemptionsRouter);
};

export default initRoutes;

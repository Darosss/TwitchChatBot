import overlayRouter from "./overlay.route";
import messagesRouter from "./messages.route";
import usersRouter from "./users.route";

const initRoutes = (app: any) => {
  app.use("/", overlayRouter);
  app.use("/users", usersRouter);
  app.use("/messages", messagesRouter);
};

export default initRoutes;

import overlayRouter from "./overlay.route";
import messagesRouter from "./messages.route";

const initRoutes = (app: any) => {
  app.use("/", overlayRouter);
  app.use("/messages", messagesRouter);
};

export default initRoutes;

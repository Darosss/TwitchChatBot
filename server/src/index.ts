import "module-alias/register";
import "./discord";
import { initMongoDataBase, backendPort } from "@configs";
import expressApp from "./app";
import { logger } from "@utils";
import { newSocket } from "./socketIO";
import init from "./stream/initializeHandlers";

const startServer = async () => {
  await initMongoDataBase();

  const server = expressApp();

  const socketIO = newSocket(server);

  try {
    await init(socketIO);
  } catch (err) {
    console.log("Error occured while trying to init handlers", err);
  }

  server.listen(backendPort, async () => {
    console.log("listening on *:", backendPort);
  });
};

startServer().catch((error) => {
  console.error(error);
});

process.on("unhandledRejection", async (error) => {
  console.log("=== UNHANDLED REJECTION ===");
  logger.error(`UNHANDLED-ERROR - ${error}`);
});

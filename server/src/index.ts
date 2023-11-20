import "module-alias/register";
import { initMongoDataBase, backendPort } from "@configs";

import expressApp from "./app";
import { logger } from "@utils";
import "./discord";

const startServer = async () => {
  await initMongoDataBase();

  const server = expressApp();

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

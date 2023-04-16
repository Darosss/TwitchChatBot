import * as dotenv from "dotenv";
import "module-alias/register";
import { envFilePath } from "@configs/globalPaths";
dotenv.config({ path: envFilePath });

import initMongoDataBase from "@configs/database";
import expressApp from "./app";
import { logger } from "@utils/loggerUtil";
import { backendPort } from "@configs/envVariables";

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

process.on("unhandledRejection", async (error, p) => {
  console.log("=== UNHANDLED REJECTION ===");
  logger.error(`UNHANDLED-ERROR - ${error}`);
});

import dotenv from "dotenv";
import "module-alias/register";

import initMongoDataBase from "@configs/database";
import expressApp from "./app";
import { logger } from "@utils/loggerUtil";
import { envFilePath } from "@configs/globalPaths";

dotenv.config({ path: envFilePath });

const startServer = async () => {
  await initMongoDataBase();

  const server = expressApp();

  server.listen(process.env.BACKEND_PORT, async () => {
    console.log("listening on *:", process.env.BACKEND_PORT);
  });
};

startServer().catch((error) => {
  console.error(error);
});

process.on("unhandledRejection", async (error, p) => {
  console.log("=== UNHANDLED REJECTION ===");
  logger.error(`UNHANDLED-ERROR - ${error}`);
});

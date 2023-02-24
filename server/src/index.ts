import dotenv from "dotenv";
import path from "node:path";
import "module-alias/register";

import initMongoDataBase from "@configs/database";
import expressApp from "./app";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

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

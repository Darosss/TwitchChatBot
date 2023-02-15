import dotenv from "dotenv";
import path from "node:path";

import initMongoDataBase, { initDefaultsDB } from "./mongoDBConn";
import expressApp from "./app";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

initMongoDataBase();
initDefaultsDB();

const server = expressApp();

server.listen(process.env.BACKEND_PORT, () => {
  console.log("listening on *:", process.env.BACKEND_PORT);
});

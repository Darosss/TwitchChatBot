import dotenv from "dotenv";

import initMongoDataBase from "./mongoDBConn";
import expressApp from "./app";

dotenv.config();

initMongoDataBase();

const server = expressApp();

server.listen(process.env.BACKEND_PORT, () => {
  console.log("listening on *:", process.env.BACKEND_PORT);
});

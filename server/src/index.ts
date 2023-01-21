import dotenv from "dotenv";
import * as ClientTmi from "./twitch-tmi";
import initMongoDataBase from "./mongoDBConn";
import expressApp from "./app";

dotenv.config();

initMongoDataBase();

const { server, localSocketIO } = expressApp();

const TwitchTmi = ClientTmi.default(localSocketIO);
TwitchTmi.connect();

server.listen(process.env.BACKEND_PORT, () => {
  console.log("listening on *:", process.env.BACKEND_PORT);
});

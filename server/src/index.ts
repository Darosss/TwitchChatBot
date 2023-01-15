import dotenv from "dotenv";
import * as ClientTmi from "./twitch-tmi";
import http from "http";
import localSocket from "./local-socket";
import initMongoDataBase from "./mongoDBConn";
import expressApp from "./app";

dotenv.config();

initMongoDataBase();

const app = expressApp();
const server = http.createServer(app);

const localSocketIO = localSocket(server);

const TwitchTmi = ClientTmi.default(localSocketIO);
TwitchTmi.connect();

server.listen(process.env.BACKEND_PORT, () => {
  console.log("listening on *:", process.env.BACKEND_PORT);
});

import express from "express";
import dotenv from "dotenv";
import * as ClientTmi from "./twitch-tmi";
import http from "http";
import cors from "cors";

import localSocket from "./local-socket";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;

const server = http.createServer(app);

const localSocketIO = localSocket(server);

const TwitchTmi = ClientTmi.default(localSocketIO);

TwitchTmi.connect();

server.listen(port, () => {
  console.log("listening on *:", port);
});

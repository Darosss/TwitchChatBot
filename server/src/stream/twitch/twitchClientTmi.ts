import tmi from "tmi.js";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@libs/types";
import StreamHandler from "../StreamHandler";
import { createUserIfNotExist } from "@services/users";
import { messageLogger } from "@utils/loggerUtil";

const clientTmi = (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  streamHandler: StreamHandler,
  userNameToListen: string
) => {
  const client = new tmi.Client({
    options: { debug: false },
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      password: process.env.password,
      username: process.env.username,
    },
    channels: [userNameToListen],
    logger: {
      info(message) {
        console.log(
          `${new Date().toISOString().split("T")[1].split(".")[0]} ${message}`
        );
      },
      warn(message) {
        console.log("WARN", message);
      },
      error(message) {
        console.log("ERROR", message);
      },
    },
  });

  client.on("connected", () => {
    io.on("connect", (socket) => {
      socket.on("messageClient", (message) => {
        client.say(userNameToListen, message);
        //after connect to client add listen to messageClient event when user connects to socket
      });
    });
  });

  client.on("disconnected", () => {
    console.log("DISCONNECTED - clearing interval");
  });

  client.on("message", async (channel, tags, message, self) => {
    const userData = {
      username: tags["display-name"] || "undefinedUsername",
      twitchName: tags.username || "undefinedTwitchName",
      twitchId: tags["user-id"] || "undefinedTwitchId",
      ...(self && { twitchId: process.env.botid! }), //
      privileges: 0,
    };
    messageLogger.info(`${userData.username}: ${message}`);

    io.emit("messageServer", new Date(), userData.username, message); // emit for socket

    const user = await createUserIfNotExist(
      { twitchId: userData.twitchId },
      userData
    );
    if (!user) return;

    const messagesToSend = await streamHandler.onMessageEvents(
      user,
      message,
      self
    );

    messagesToSend.forEach((message, index) => {
      setTimeout(() => {
        client.say(channel, message);
      }, 1000 * (index + 1));
    });
  });

  return client;
};
export default clientTmi;

import tmi from "tmi.js";
// import BotTimer from "../chatbot/bot-timer";
// import BotLog from "../chatbot/bot-logs";
// import bot_commands from "../configs/bot_commands.json";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@libs/types";
import BotStatisticDatabase from "../chatbot/database-statistic";
import { createUserIfNotExist } from "@services/User";
import { messageLogger } from "@utils/logger.util";
require("dotenv").config();

const clientTmi = (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  botStatisticDatabase: BotStatisticDatabase,
  userNameToListen: string
) => {
  const msgsLogger = messageLogger(userNameToListen);

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

      privileges: 0,
    };

    msgsLogger.info(`${userData.username}: ${message}`);

    io.emit("messageServer", new Date(), userData.username, message); // emit for socket

    const user = await createUserIfNotExist(userData, userData);

    if (!user) return;

    await botStatisticDatabase.saveMessageToDatabase({
      owner: user._id,
      message: message,
      date: new Date(),
      ownerUsername: userData.username,
    });
    await botStatisticDatabase.updateUserStatistics(user._id);

    if (self) return; //echoed msg from bot

    const triggerAnswer = await botStatisticDatabase.checkMessageToTriggerWord(
      message
    );
    const commandAnswer = await botStatisticDatabase.checkMessageForCommand(
      user,
      message
    );

    commandAnswer ? client.say(channel, commandAnswer) : null;
    triggerAnswer ? client.say(channel, triggerAnswer) : null;

    // botTimerObj.initOnMessage(client, channel, message, senderName);
  });

  return client;
};
export default clientTmi;
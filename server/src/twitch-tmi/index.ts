import tmi from "tmi.js";
import BotTimer from "../chatbot/bot-timer";
import BotLog from "../chatbot/bot-logs";
import bot_commands from "../configs/bot_commands.json";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@libs/types";
import BotStatisticDatabase from "../chatbot/database-statistic";
require("dotenv").config();

const clientTmi = (
  socket: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  botStatisticDatabase: BotStatisticDatabase,
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
  });
  const botLogObj = new BotLog(userNameToListen);
  const botTimerObj = new BotTimer(client, bot_commands);

  client.on("connected", () => {
    console.log("CONNECTED - I set the intervals now");
    botTimerObj.initOnJoinToChannel(userNameToListen);
  });

  client.on("disconnected", () => {
    console.log("DISCONNECTED - clearing interval");
  });

  function logMsg(username: string, msg: string) {
    console.log(
      `[${
        new Date().toISOString().split("T")[1].split(".")[0]
      }] - ${username}:${msg}`
    );
  }

  client.on("join", async (channel, username, self) => {
    console.log(`${username} joined the chat -- checking if user is in DB`);
    const user = await botStatisticDatabase.isUserInDB(username);

    if (!user) return;
    await botStatisticDatabase.updateUserStatistics(user.id);
  });

  client.on("message", async (channel, tags, message, self) => {
    let channelName = channel.slice(1);
    let senderName = tags.username || "undefined";

    socket.emit("messageServer", new Date(), senderName, message); // emit for socket

    logMsg(senderName, message);

    // botLogObj.countMessages(channelName, senderName);
    // botLogObj.logMessages(channelName, senderName, message);

    const user = await botStatisticDatabase.isUserInDB(senderName);

    if (!user) return;

    await botStatisticDatabase.saveMessageToDatabase(user.id, message);
    await botStatisticDatabase.updateUserStatistics(user.id);

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

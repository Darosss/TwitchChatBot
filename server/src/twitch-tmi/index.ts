import tmi from "tmi.js";
import BotTimer from "../chatbot/bot-timer";
import BotLog from "../chatbot/bot-logs";
import config from "../configs/config-tmi.json";
import bot_commands from "../configs/bot_commands.json";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../../libs/types";
import BotStatisticDatabase from "../chatbot/database-statistic";
require("dotenv").config();

const channelsToJoin: string[] = config["channels"];
const clientTmi = (
  socket: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
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
    channels: channelsToJoin,
  });
  const botLogObj = new BotLog(config);
  const botTimerObj = new BotTimer(client, bot_commands);
  const botStatisticDatabase = new BotStatisticDatabase();

  client.on("connected", () => {
    console.log("CONNECTED - I set the intervals now");
    channelsToJoin.forEach((channel) => {
      botTimerObj.initOnJoinToChannel(channel.slice(1));
    });
  });
  client.on("disconnected", () => {
    console.log("DISCONNECTED - clearing interval");
  });

  function logMsg(username: string, msg: string) {
    const msgTime = new Date();
    const wholeMessage = `${msgTime.getHours()}:${msgTime.getMinutes()}:${msgTime.getSeconds()}`;
    console.log(`[${wholeMessage}] - ${username}:${msg}`);
  }

  client.on("join", async (channel, username, self) => {
    console.log(`${username} joined the chat -- checking if user is in DB`);
    await botStatisticDatabase.isUserInDB(username);
  });

  client.on("message", async (channel, tags, message, self) => {
    let channelName = channel.slice(1);
    let senderName = tags.username || "undefined";

    socket.emit("messageServer", new Date(), senderName, message); // emit for socket

    logMsg(senderName, message);

    botLogObj.countMessages(channelName, senderName);
    botLogObj.logMessages(channelName, senderName, message);

    const user = await botStatisticDatabase.isUserInDB(senderName);
    if (!user) return;

    await botStatisticDatabase.saveMessageToDatabase(user.id, message);

    await botStatisticDatabase.onMessageActions(user.id);

    if (self) return; //echoed msg from bot

    if (senderName == config.bot_username) return;
    botTimerObj.initOnMessage(client, channel, message, senderName);
  });

  return client;
};
export default clientTmi;

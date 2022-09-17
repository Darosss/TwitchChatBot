const tmi = require("tmi.js");
const BotTimer = require("./botTimer.js");
const BotLog = require("./botLog.js");
var clc = require("./cli_color.js");
const config = require("./configs/configHead.json");
const bot_commands = require("./configs/bot_commands.json");
require("dotenv").config();

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
  channels: config.channels,
});
const botLogObj = new BotLog(config);
const botTimerObj = new BotTimer(client, bot_commands);
client.connect();

client.on("connected", () => {
  console.log(clc.notice("CONNECTED", clc.info("- I set the intervals now")));
  config.channels.forEach((channel) => {
    botTimerObj.initOnJoinToChannel(channel.slice(1));
  });
});
client.on("disconnected", (reason) => {
  console.log(clc.error("DISCONNECTED"), clc.notice("-clearing interval"));
});

function logMsg(username, msg) {
  let msgTime = new Date();
  msgTime = `${msgTime.getHours()}:${msgTime.getMinutes()}:${msgTime.getSeconds()}`;
  console.log(`[${clc.msg(msgTime)}] - ${clc.name(username)}:${clc.msg(msg)}`);
}

client.on("message", (channel, tags, message, self) => {
  logMsg(tags.username, message);
  if (self) return; //echoed msg from bot
  botLogObj.countMessages(channel.slice(1), tags.username);
  botLogObj.logMessages(channel.slice(1), tags.username, message);
  if (tags.username == config.bot_username) return;
  botTimerObj.initOnMessage(client, channel, message, tags.username);
});

const tmi = require("tmi.js");
const BotTimer = require("./botTimer.js");
const BotLog = require("./botLog.js");
var clc = require("./cli_color.js");
const config_file = require("./configs/configHead.js");
const bot_commands = require("./configs/bot_commands.json");
require("dotenv").config();

let timer_interval;
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
  channels: config_file.options.channels,
});

//TODO change configs to json
const botLogObj = new BotLog(config_file.options);
const botTimerObj = new BotTimer(client, bot_commands);
client.connect();

client.on("connected", () => {
  console.log(clc.notice("CONNECTED"));
  client.on("join", (channel, self) => {
    if (!self || timer_interval) return;
    console.log(clc.notice("BOT JOINED"), clc.info("- It set the intervals"));
    timer_interval = botTimerObj.checkTimersInterval(client, channel.slice(1));
    botTimerObj.checkChatGamesInterval();
  });
});
client.on("disconnected", (reason) => {
  if (timer_interval) {
    console.log(clc.error("DISCONNECTED"), clc.notice("-clearing interval"));
    clearInterval(timer_interval);
  }
});

function logMsg(username, msg) {
  let msgTime = new Date();
  msgTime = `${msgTime.getHours()}:${msgTime.getMinutes()}:${msgTime.getSeconds()}`;
  console.log(`[${clc.msg(msgTime)}] - ${clc.name(username)}:${clc.msg(msg)}`);
}

client.on("message", (channel, tags, message, self) => {
  logMsg(tags.username, message);
  botLogObj.countMessages(channel.slice(1), tags.username);
  botLogObj.logMessages(channel.slice(1), tags.username, message);
  if (self) return; //echoed msg from bot
  if (tags.username == config_file.options.username) return;
  botTimerObj.initOnMessage(client, channel, message, tags.username);
});

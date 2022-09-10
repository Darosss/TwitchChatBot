const tmi = require("tmi.js");
const BotTimer = require("./botTimer.js");
const BotLog = require("./botLog.js");
var clc = require("./cli_color.js");
const config_file = require("./configHead.js");
const bot_commands = require("./bot_commands.json");
require("dotenv").config();
const botLogObj = new BotLog(config_file.options);
const botTimerObj = new BotTimer(bot_commands);
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

client.connect();
let timer_interval;
client.on("connected", () => {
  console.log(clc.notice("CONNECTED"));
  client.on("join", (channel) => {
    if (timer_interval) return;
    // if timer is set return
    timer_interval = botTimerObj.checkTimersInterval(client, channel.slice(1));
    console.log(clc.notice("JOINED"), clc.info("- I set the interval "));
  });
});
client.on("disconnected", (reason) => {
  if (timer_interval) {
    console.log(clc.error("DISCONNECTED"), clc.notice("-clearing interval"));
    clearInterval(timer_interval);
  }
});
client.on("message", (channel, tags, message, self) => {
  let msgTime = new Date();
  msgTime = `${msgTime.getHours()}:${msgTime.getMinutes()}:${msgTime.getSeconds()}`;

  console.log(
    `[${clc.msg(msgTime)}] - ${clc.name(tags.username)}:${clc.msg(message)}`
  );
  botLogObj.countMessages(channel, tags.username);
  botLogObj.logMessages(channel, tags.username, message);
  if (self) return; //echoed msg
  if (tags.username == config_file.options.username) return;
  // need to be because bot can all alone cont msgs
  botTimerObj.countTimers(channel.slice(1), tags.username); //tags["display-name"]

  botTimerObj.checkTriggers(client, channel, message);
  // check message for trigger from json
});

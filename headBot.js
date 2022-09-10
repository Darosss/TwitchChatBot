const tmi = require("tmi.js");
const BotTimer = require("./botTimer.js");
const BotLog = require("./botLog.js");
const config_file = require("./configHead.js");
const bot_commands = require("./bot_commands.json");
require("dotenv").config();
// TODO Convert timers/trigers to json/xml or sth
// TODO CHANGE ALL FOR LOOP FOREACH WHEN CAN its More readable for me then

const botLogObj = new BotLog(config_file.options);
const botTimerObj = new BotTimer(bot_commands);

const client = new tmi.Client({
  options: { debug: true },
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

client.on("join", (channel, username, self) => {
  botTimerObj.checkTimersInterval(client, channel.slice(1));
});
client.on("message", (channel, tags, message, self) => {
  botLogObj.countMessages(channel, tags.username);
  botLogObj.logMessages(channel, tags.username, message);
  if (self) return; //echoed msg
  if (tags.username == config_file.options.username) return;
  // need to be because bot can all alone cont msgs
  botTimerObj.countTimers(channel.slice(1), tags.username); //tags["display-name"]

  botTimerObj.checkTrigger(client, channel, message);
  // check message for trigger from json
});

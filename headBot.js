const tmi = require("tmi.js");
const BotTimer = require("./botTimer.js");
const BotLog = require("./botLog.js");
var clc = require("./cli_color.js");
const config_file = require("./configs/configHead.js");
const bot_commands = require("./configs/bot_commands.json");
require("dotenv").config();
const botLogObj = new BotLog(config_file.options);

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
const botTimerObj = new BotTimer(client, bot_commands);
client.connect();
let timer_interval;
client.on("connected", () => {
  console.log(clc.notice("CONNECTED"));
  client.on("join", (channel, self) => {
    if (timer_interval) return;
    // probably do not need this for later
    if (!self) return;
    console.log(clc.notice("BOT JOINED"), clc.info("- It set the intervals"));
    timer_interval = botTimerObj.checkTimersInterval(client, channel.slice(1));
    botTimerObj.checkChatGames(client);
  });
});
client.on("disconnected", (reason) => {
  if (timer_interval) {
    console.log(clc.error("DISCONNECTED"), clc.notice("-clearing interval"));
    clearInterval(timer_interval);
  }
});
// setInterval(() => {
//   console.log(clc.error("WYSYLAM WIADOMOSC"));
//   botTimerObj.checkChatGames(client);
// }, 3000);
// botTimerObj.checkChatGames("c", "mesg");
// botTimerObj.checkChatGames("c", "2nd");
// botTimerObj.checkChatGames("c", "3nd");
function logMsg(username, msg) {
  let msgTime = new Date();
  msgTime = `${msgTime.getHours()}:${msgTime.getMinutes()}:${msgTime.getSeconds()}`;
  console.log(`[${clc.msg(msgTime)}] - ${clc.name(username)}:${clc.msg(msg)}`);
}

client.on("message", (channel, tags, message, self) => {
  logMsg(tags.username, message);

  // botLogObj.countMessages(channel, tags.username);
  // botLogObj.logMessages(channel, tags.username, message);
  if (self) return; //echoed msg
  // if (tags.username == config_file.options.username) return;
  // disabled for now for debug

  // botTimerObj.checkChatGames(client, channel);
  // botTimerObj.addActiveUser(tags.username);
  // botTimerObj.countTimers(channel.slice(1), tags.username);
  // botTimerObj.checkTriggers(client, channel, message);
});

// client.on("part", (channel, username, self) => {
//   console.log("left", channel, username);

//   // Do your stuff.
// });
// client.on("join", (channel, username, self) => {
//   console.log("joined", channel, username);
// });

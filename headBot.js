const tmi = require("tmi.js");
const functionsHead = require("./functionsHead.js");

const broadcaster = "booksarefunsometimes";
const config = require("./configHead.js");
const auth_conf = require("./auth.js");
const auth = auth_conf.auth;
const pathUserJson = [];
const usersJson = [];

class BotChleb {
  constructor(config) {
    this.config = config;
    this.triggers = this.config.timers.words;
  }
  checkTrigger(client, channel, msg) {
    let trig_key = Object.keys(this.triggers);
    for (let i = 0; i < trig_key.length; i++) {
      let trigger = this.triggers[trig_key[i]];
      let trigger_word = trigger[0];
      if (trigger[2]) {
        console.log(trigger_word);
        if (msg.toLowerCase().includes(trigger_word)) {
          this.triggers[trig_key[i]][2] = false;
          // its must be like this, because it should change this.triggers
          client.say(channel, trigger[1]);
          var that = this;
          setTimeout(function () {
            console.log("Trigger can be used now again: ", trigger_word);
            that.triggers[trig_key[i]][2] = true;
          }, trigger[3] * 1000);
        }
      } else {
        console.log("za wczesnie na " + trigger_word);
      }
    }
  }
  wassup() {
    console.log("chuj");
  }
}

const botChleb = new BotChleb(config.options);
botChleb.greet;
var chan = config.options.channels.arr;
var pref = config.options.channels.pref;
var bots = config.options.bots;
var commands = config.options.commands;
var words = config.options.words;

var today = new Date();
var todayM =
  today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();

var sentences = [];
var intervalOnce = true;
if (config.options.channelsSeparately) {
  for (let i = 0; i < chan.length; i++) {
    var dir = [];
    dir[i] = "./" + config.options.folderName + "/" + chan[i] + "/" + todayM;
    sentences[i] =
      dir[i] +
      "/" +
      todayM +
      "-" +
      chan[i] +
      "-" +
      config.options.nameSentence +
      ".txt";
    functionsHead.checkAndCreate(dir[i], sentences[i]);

    var dirUserJson = "./" + config.options.folderName + "/" + chan[i];
    pathUserJson[chan[i]] = dirUserJson + "/" + chan[i] + "-users.json";

    functionsHead.createNewJsonUsers(usersJson[chan[i]], pathUserJson[chan[i]]);
    usersJson[chan[i]] = require(pathUserJson[chan[i]]);
    //change to when exist - return;
  }
} else {
  var dr = "./" + config.options.folderName + "/" + todayM;
  var snt = dr + "/" + todayAll + "-" + config.options.nameSentence + ".txt";
  functionsHead.checkAndCreate(dr, snt);
}

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    password: auth,
    username: broadcaster,
  },
  channels: chan,
});
client.connect();

client.on("message", (channel, tags, message, self) => {
  // if(intervalOnce){
  // intervalOnce = false;
  // setInterval(function(){
  // client.say(channel, config.options.timers.zabolGame[0]);
  // },config.options.timers.zabolGame[1]);
  // }
  if (tags["display-name"] == config.options.username) return;
  // if sender message == bot = return;

  botChleb.checkTrigger(client, channel, message);
  // check message for trigger from config

  var nowDate = new Date();
  nowDate =
    nowDate.getFullYear() +
    "-" +
    nowDate.getMonth() +
    "-" +
    nowDate.getDate() +
    " " +
    nowDate.getHours() +
    ":" +
    nowDate.getMinutes() +
    ":" +
    nowDate.getSeconds();
  for (let i = 0; i < chan.length; i++) {
    functionsHead.appendToFile(
      sentences[i],
      message +
        config.options.splitLetter +
        tags.username +
        config.options.splitLetter +
        nowDate
    );
  }
  var foundUser = false;
  var lastSeenDate = new Date();
  var hours = lastSeenDate.getHours();
  hours = hours > 9 ? hours : "0" + hours;
  var minutes = lastSeenDate.getMinutes();
  minutes = minutes > 9 ? minutes : "0" + minutes;
  var seconds = lastSeenDate.getSeconds();
  seconds = seconds > 9 ? seconds : "0" + seconds;

  lastSeenDate =
    lastSeenDate.getFullYear() +
    "-" +
    lastSeenDate.getMonth() +
    "-" +
    lastSeenDate.getDate() +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  var which = 0;

  var channelName = channel.replace("#", "");
  for (let i = 0; i < usersJson[channelName].length; i++) {
    var user = usersJson[channelName][i];
    if (user.hasOwnProperty("name")) {
      if (user.name == tags.username) {
        //console.log("Found user in json");
        foundUser = true;
        which = i;
        //console.log(pathUserJson[channelName]);
        functionsHead.writeJsonData(
          pathUserJson[channelName],
          which,
          lastSeenDate
        );
        break;
      }
    }
  }
  if (!foundUser) {
    console.log("potrzeba stworzyc nowego jsona objecta ");
    usersJson[channelName].push({
      name: tags.username,
      messages: 1,
      lastSeen: lastSeenDate,
    });
  }
});

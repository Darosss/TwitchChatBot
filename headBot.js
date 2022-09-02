const tmi = require("tmi.js");
const functionsHead = require("./functionsHead.js");

const config = require("./configHead.js");
const userData = require("./auth.js");
const username = userData.username;
const userAuth = userData.auth;

class BotChleb {
  constructor(config) {
    this.config = config;
    this.triggers = this.config.timers.words;
    this.chanels = this.config.channels;
    this.logMsgDir = [];
    this.logMsg = [];
    this.usersDir = [];
    this.usersJson = [];
    this.#createNonExistingJsons();
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
  #createNonExistingJsons() {
    if (this.config.channelsSeparately) {
      //TODO create else condition where == false
      // and add users from all channels to one file
      // not needed for now
      var today = new Date();
      today = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
      var dir = [];
      for (let i = 0; i < this.chanels.length; i++) {
        dir[i] = `./${config.options.folderName}/${this.chanels[i]}`;
        this.#createUsersJson(dir[i], this.chanels[i], "users");
        this.#createSentencesJson(dir[i], this.chanels[i], today, "sentences");
      }
    }
  }
  #createUsersJson(dir, channel, suffix) {
    this.usersDir[channel] = `${dir}/${channel}-${suffix}.json`;
    this.#createNewJsonFile(dir, this.usersDir[channel]);
    this.usersJson[channel] = require(this.usersDir[channel]);
  }
  #createSentencesJson(dir, channel, time, suffix) {
    this.logMsgDir[channel] = `${dir}/${time}-${channel}-${suffix}.json`;
    this.#createNewJsonFile(dir, this.logMsgDir[channel]);

    this.logMsg[channel] = require(this.logMsgDir[channel]);
  }

  #createNewJsonFile(folder, userJson) {
    var fs = require("fs");
    if (!fs.existsSync(folder)) {
      console.log("Folder path does not exist:", folder);
      fs.mkdirSync(folder, { recursive: true });
    }
    if (fs.existsSync(userJson)) {
      // path exists
      console.log("exists:", userJson);
    } else {
      let result = [];
      const jsonString = JSON.stringify(result);
      fs.writeFileSync(userJson, jsonString);
      console.log("DOES NOT exist:", userJson);
    }
  }
  #rewriteJson(dirLog, msgsChannel) {
    const fs = require("fs");
    fs.writeFile(
      dirLog,
      JSON.stringify(msgsChannel, null, 2),

      function writeJSON(err) {
        if (err) return console.log(err);
        console.log("Writing message to " + dirLog);
      }
    );
  }
  #formatDateYMDHMS() {
    var lastSeenDate = new Date();
    var ymd = `${lastSeenDate.getFullYear()}-${lastSeenDate.getMonth()}-${lastSeenDate.getDate()}`;
    var hours = lastSeenDate.getHours();
    var minutes = lastSeenDate.getMinutes();
    var seconds = lastSeenDate.getSeconds();

    hours = hours > 9 ? hours : "0" + hours;
    minutes = minutes > 9 ? minutes : "0" + minutes;
    seconds = seconds > 9 ? seconds : "0" + seconds;
    // convert instead 1/01 2/02 etc
    lastSeenDate = `${ymd} ${hours}:${minutes}:${seconds}`;
    return lastSeenDate;
  }
  countMessages(channel, chatter) {
    var foundUser = false;
    var which = 0;

    var channelName = channel.replace("#", "");
    // replace beacause channel includes # in nickname(dunno why)
    for (let i = 0; i < this.usersJson[channelName].length; i++) {
      var user = this.usersJson[channelName][i];
      if (user.hasOwnProperty("name")) {
        if (user.name == chatter) {
          foundUser = true;
          which = i;
          this.usersJson[channelName][i].messages++;
          this.usersJson[channelName][i].lastSeen = this.#formatDateYMDHMS();
        }
      }
    }
    if (!foundUser) {
      // not found object named channel name, need create new
      console.log("Need to create new json object inside users");
      this.usersJson[channelName].push({
        name: chatter,
        messages: 1,
        lastSeen: lastSeenDate,
      });
    }
    this.#rewriteJson(this.usersDir[channelName], this.usersJson[channelName]);
  }
  logMessages(channel, chatter, msg) {
    var channelName = channel.replace("#", "");
    // replace beacause channel includes # in nickname(dunno why)
    this.logMsg[channelName].push({
      name: chatter,
      messages: msg,
      date_msg: this.#formatDateYMDHMS(),
    });
    this.#rewriteJson(this.logMsgDir[channelName], this.logMsg[channelName]);
  }
}
const botChleb = new BotChleb(config.options);
var intervalOnce = true;
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    password: userAuth,
    username: username,
  },
  channels: config.options.channels,
});
client.connect();

client.on("message", (channel, tags, message, self) => {
  // if(intervalOnce){
  // intervalOnce = false;
  // setInterval(function(){
  // client.say(channel, config.options.timers.zabolGame[0]);
  // },config.options.timers.zabolGame[1]);
  // }
  botChleb.countMessages(channel, tags.username);
  botChleb.logMessages(channel, tags.username, message);

  if (tags["display-name"] == config.options.username) return;
  // if sender message == bot = return;
  botChleb.checkTrigger(client, channel, message);
  // check message for trigger from config
});

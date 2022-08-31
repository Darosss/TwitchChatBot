const tmi = require("tmi.js");
const functionsHead = require("./functionsHead.js");

const config = require("./configHead.js");
const userData = require("./auth.js");
const username = userData.username;
const userAuth = userData.auth;
const pathUserJson = [];
const usersJson = [];

class BotChleb {
  constructor(config) {
    this.config = config;
    this.triggers = this.config.timers.words;
    this.chanels = this.config.channels;
    this.sentences = [];
    this.checkIfJsonExist();
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
  checkIfJsonExist() {
    if (this.config.channelsSeparately) {
      var today = new Date();
      today = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
      var dir = [];
      for (let i = 0; i < this.chanels.length; i++) {
        dir[i] = `./${config.options.folderName}/${this.chanels[i]}/${today}`;
        this.sentences[
          i
        ] = `${dir[i]}/${today}-${this.chanels[i]}-${this.config.nameSentence}.txt`;

        this.checkAndCreate(dir[i], this.sentences[i]);

        var dirUserJson = `./${config.options.folderName}/${this.chanels[i]}`;
        pathUserJson[
          this.chanels[i]
        ] = `${dirUserJson}/${this.chanels[i]}-users.json`;

        this.createNewJsonUsers(
          usersJson[this.chanels[i]],
          pathUserJson[this.chanels[i]]
        );
        usersJson[this.chanels[i]] = require(pathUserJson[this.chanels[i]]);
        //change to when exist - return;
      }
    }
  }
  checkAndCreate(folder, file) {
    const fs = require("fs");
    var dir = folder;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(file)) {
      // path exists
      console.log("exists:", file);
    } else {
      fs.writeFile(file, "", function (err) {
        if (err) throw err;
        console.log("File is created successfully.");
      });
      console.log("DOES NOT exist:", file);
    }
  }
  createNewJsonUsers(userChan, userJson) {
    var fs = require("fs");

    if (fs.existsSync(userJson)) {
      // path exists
      console.log("exists:", userJson);
    } else {
      let result = [];
      const jsonString = JSON.stringify(result);
      fs.writeFileSync(userJson, jsonString);
      userChan = require(userJson);
      console.log("DOES NOT exist:", file);
    }
  }
}

const botChleb = new BotChleb(config.options);
botChleb.greet;
var pref = config.options.channels.pref;
var bots = config.options.bots;
var commands = config.options.commands;
var words = config.options.words;

var sentences = [];
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
  if (tags["display-name"] == config.options.username) return;
  // if sender message == bot = return;

  botChleb.checkTrigger(client, channel, message);
  // check message for trigger from config
  botChleb.countMessage();
  botChleb.logMessage();
  //   var nowDate = new Date();
  //   nowDate =
  //     nowDate.getFullYear() +
  //     "-" +
  //     nowDate.getMonth() +
  //     "-" +
  //     nowDate.getDate() +
  //     " " +
  //     nowDate.getHours() +
  //     ":" +
  //     nowDate.getMinutes() +
  //     ":" +
  //     nowDate.getSeconds();
  //   for (let i = 0; i < chan.length; i++) {
  //     functionsHead.appendToFile(
  //       sentences[i],
  //       message +
  //         config.options.splitLetter +
  //         tags.username +
  //         config.options.splitLetter +
  //         nowDate
  //     );
  //   }
  //   var foundUser = false;
  //   var lastSeenDate = new Date();
  //   var hours = lastSeenDate.getHours();
  //   hours = hours > 9 ? hours : "0" + hours;
  //   var minutes = lastSeenDate.getMinutes();
  //   minutes = minutes > 9 ? minutes : "0" + minutes;
  //   var seconds = lastSeenDate.getSeconds();
  //   seconds = seconds > 9 ? seconds : "0" + seconds;

  //   lastSeenDate =
  //     lastSeenDate.getFullYear() +
  //     "-" +
  //     lastSeenDate.getMonth() +
  //     "-" +
  //     lastSeenDate.getDate() +
  //     " " +
  //     hours +
  //     ":" +
  //     minutes +
  //     ":" +
  //     seconds;
  //   var which = 0;

  //   var channelName = channel.replace("#", "");
  //   for (let i = 0; i < usersJson[channelName].length; i++) {
  //     var user = usersJson[channelName][i];
  //     if (user.hasOwnProperty("name")) {
  //       if (user.name == tags.username) {
  //         //console.log("Found user in json");
  //         foundUser = true;
  //         which = i;
  //         //console.log(pathUserJson[channelName]);
  //         functionsHead.writeJsonData(
  //           pathUserJson[channelName],
  //           which,
  //           lastSeenDate
  //         );
  //         break;
  //       }
  //     }
  //   }
  //   if (!foundUser) {
  //     console.log("potrzeba stworzyc nowego jsona objecta ");
  //     usersJson[channelName].push({
  //       name: tags.username,
  //       messages: 1,
  //       lastSeen: lastSeenDate,
  //     });
  //   }
});

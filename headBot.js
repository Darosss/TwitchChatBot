const tmi = require("tmi.js");
const TwitchApi = require("node-twitch").default;
require("dotenv").config();
const config_file = require("./configHead.js");

const twApi = new TwitchApi({
  client_id: process.env.client_id,
  client_secret: process.env.client_secret,
});
// TODO CHANGE ALL FOR LOOP FOREACH WHEN CAN its More readable for me then
class BotTimer {
  constructor(config) {
    this.config = config;
    this.triggers = this.config.triggers;
    this.timers = this.config.timers;
    this.msgs_count = [];
    Object.keys(this.timers).forEach((element) => {
      this.msgs_count[element] = 0;
    });
    // SET EVERY MSG COUNT TO 0 WHEN STARTING BOT
    console.log(this.msgs_count);
  }
  checkTrigger(client, channel, msg) {
    let trig_key = Object.keys(this.triggers);
    for (let i = 0; i < trig_key.length; i++) {
      let trigger = this.triggers[trig_key[i]];
      let trigger_word = trigger[0];
      if (trigger[2]) {
        // console.log(trigger_word);
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
  // TODO need to do here sth like config[...]...phrases.format
  // fe.
  // format.datediff = true \\ false
  // means: false == will be normal date fe. 2022/4/9
  // true == 50 days difference betwen today and this date
  returnFollowMsg(date = "", name = "") {
    var random = Math.floor(
      Math.random() * this.timers.follower.phrases.length
    );
    var dat;
    if (date.length > 0) {
      var follow_at = date.split("T")[0].split("-");
      dat = new Date(follow_at[0], follow_at[1], follow_at[2]);
    }
    const diffTime = Math.abs(new Date() - dat);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    var msg =
      this.timers.follower.phrases[random][0] +
      diffDays +
      this.timers.follower.phrases[random][1] +
      name +
      this.timers.follower.phrases[random][2];
    return msg;
  }
  returnNormalMsg(from) {
    var random = Math.floor(Math.random() * from.phrases.length);
    return from.phrases[random];
  }
  async getUserId(loginName) {
    const users = await twApi.getUsers(loginName);
    const user = users.data[0];
    const userId = user.id;
    return userId;
  }
  async getRandomFollower(channel) {
    return await twApi
      .getFollows({
        to_id: (await this.getUserId(channel)).toString(),
      })
      .then((result) => {
        var random = Math.floor(Math.random() * result.data.length);
        return result.data[random];
      });
  }
  async isFollowing(broadcaster, chatter) {
    return await twApi
      .getFollows({
        to_id: (await this.getUserId(broadcaster)).toString(),
        from_id: await (await this.getUserId(chatter)).toString(),
      })
      .then((result) => {
        if (result.total <= 0) {
          return true;
        } else {
          return false;
        }
      });
  }
  async checkNormalTimer(client, channel, chatter) {
    // loop throu config.options.timers...
    Object.keys(this.timers).forEach(async (element) => {
      var that = this;
      var incrMsg = 1;
      switch (element) {
        case "follower":
          await this.isFollowing(channel, chatter).then((result) => {
            if (result) {
              console.log("Not follow msg value 3");
              incrMsg = 3;
            } else {
              console.log("Follow msg value 1");
            }
          });
          break;
        default:
          console.log("Zliczam normalnego timersa");
      }
      if (
        this.timers[element].enabled &&
        this.msgs_count[element] >= this.timers[element].msg
      ) {
        if (element == "follower") {
          await this.getRandomFollower(channel).then((result) => {
            //client.say(channel, this.returnFollowMsg(result.followed_at, result.from_name));
            console.log(
              this.returnFollowMsg(result.followed_at, result.from_name)
            );
          });
        } // TODO other else is for subs/ cheers and donation if can
        else {
          console.log(this.returnNormalMsg(this.timers[element]));
        }
        this.timers[element].enabled = false; // set timer for false
        this.msgs_count[element] = 0; // reset msgs count to 0, because msg is sent

        setTimeout(function () {
          that.timers[element].enabled = true; // set time true after period of time(delay)
          console.log(element, "is up again"); // debug info
        }, that.timers[element].delay * 1000); // set timeout(f(), delay timer);
      }
      this.msgs_count[element] += incrMsg;
    });
    console.log(this.msgs_count);

    // --------------------------THATS DEBUG -------------------------------
    // else {
    //   if (
    //     !this.timers[element].enabled &&
    //     this.msgs_count[element] >= this.timers[element].msg
    //   ) {
    //     console.log(
    //       element,
    //       "is false, but messages are fine: counted:",
    //       this.msgs_count[element],
    //       "min:",
    //       this.timers[element].msg
    //     );
    //   } else if (
    //     this.timers[element].enabled &&
    //     !this.msgs_count[element] >= this.timers[element].msg
    //   ) {
    //     console.log(
    //       element,
    //       "is enabled, but messages aren't high enough counted:",
    //       this.msgs_count[element],
    //       "min:",
    //       this.timers[element].msg
    //     );
    //   } else {
    //     console.log("Nothing is true so do nothing");
    //   }
    // }
    // --------------------------THATS DEBUG -------------------------------
  }
  //checkTimerApi for taking data from json api fe. data,
  //random name follower etc(is following)
}

class BotLog {
  constructor(config) {
    this.config = config;
    this.chanels = this.config.channels;
    this.logMsgDir = [];
    this.logMsg = [];
    this.usersDir = [];
    this.usersJson = [];
    this.#createNonExistingJsons();
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
        dir[i] = `./${this.config.folderName}/${this.chanels[i]}`;
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
        lastSeen: this.#formatDateYMDHMS,
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
const botLog = new BotLog(config_file.options);
const botTimer = new BotTimer(config_file.options);
var intervalOnce = true;

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
client.on("message", (channel, tags, message, self) => {
  // if(intervalOnce){
  // intervalOnce = false;
  // setInterval(function(){
  // client.say(channel, config.options.timers.zabolGame[0]);
  // },config.options.timers.zabolGame[1]);
  // }

  // botLog.countMessages(channel, tags.username);
  // botLog.logMessages(channel, tags.username, message);

  if (tags["display-name"] == config_file.options.username) return;
  botTimer.checkNormalTimer(client, channel.slice(1), "darkohoiik"); //tags["display-name"]
  // if sender message == bot = return;
  botTimer.checkTrigger(client, channel, message);
  // check message for trigger from config
});

const TwitchApi = require("node-twitch").default;
var clc = require("./cli_color.js");
// TODO REpair error with double msgs followers etc
class BotTimer {
  constructor(commands) {
    this.cmds = commands;
    this.timers = this.cmds.timers;
    this.triggers = this.cmds.triggers;
    this.delay = this.cmds.delay * 1000;
    this.twApi = new TwitchApi({
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
    });
  }
  checkTrigger(client, channel, msg) {
    Object.keys(this.triggers).forEach((element) => {
      let trigger = this.triggers[element];
      let trigger_word = trigger.trigger;
      if (trigger.enabled) {
        if (msg.toLowerCase().includes(trigger_word)) {
          this.triggers[element].enabled = false;
          client.say(channel, trigger.msg);
          var that = this;
          setTimeout(function () {
            console.log(
              clc.notice("TRIGGER:"),
              clc.info(element.toUpperCase()),
              clc.notice("- is up again")
            );
            that.triggers[element].enabled = true;
          }, trigger.delay * 1000);
        }
      } else {
        console.log(
          clc.notice("TRIGGER:"),
          clc.info(element.toUpperCase()),
          clc.notice("- it's too early")
        );
      }
    });
  }

  returnFollowMsg(follow_date = "", name = "") {
    let follow_tim = this.timers.follower;
    follow_date = follow_date.replace("T", " ");
    follow_date = follow_date.replace("Z", "");
    let date;
    if (follow_date.length > 0) {
      let follow_at = follow_date.split(" ")[0].split("-");
      date = new Date(follow_at[0], follow_at[1], follow_at[2]);
    }
    const diffTime = Math.abs(new Date() - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let lenKeys = Object.keys(follow_tim.phrases).length - 1;
    let rand = Math.floor(Math.random() * lenKeys);
    let randKey = Object.keys(follow_tim.phrases)[rand];
    let choosenPhrase = follow_tim.phrases[randKey];
    let msg = "";
    console.log("choosenPhrase", choosenPhrase);
    if (choosenPhrase.format.includes("date")) {
      if (choosenPhrase.format.includes("diff")) {
        follow_date = diffDays;
      } else if (choosenPhrase.format.includes("only date")) {
        follow_date = follow_date.split(" ")[0];
      }
    } else {
      follow_date = "";
    }

    msg = `${choosenPhrase.phrases[0]} ${name} ${choosenPhrase.phrases[1]} ${follow_date}
      ${choosenPhrase.phrases[2]}`;
    return msg;
  }
  // For now it must be like this, the follow msg is unqie for now example:
  // TEXT ...{name of follow}  TEXT....
  //{date of follow(2 formats, diff days or normal date)} ...TEXT
  // Dates switches from config true false
  returnNormalMsg(from) {
    var random = Math.floor(Math.random() * from.phrases.length);
    return from.phrases[random];
  }
  //   //return for every other normal timer tj. only texts;

  async getUserId(loginName) {
    const users = await this.twApi.getUsers(loginName);
    const user = users.data[0];
    const userId = user.id;
    return userId;
  }
  async getRandomFollower(channel) {
    return await this.twApi
      .getFollows({
        to_id: (await this.getUserId(channel)).toString(),
      })
      .then((result) => {
        var random = Math.floor(Math.random() * result.data.length);
        return result.data[random];
      });
  }
  async isFollowing(broadcaster, chatter) {
    return await this.twApi
      .getFollows({
        to_id: (await this.getUserId(broadcaster)).toString(),
        from_id: await (await this.getUserId(chatter)).toString(),
      })
      .then((result) => {
        if (result.total <= 0) return true;
        else return false;
      });
  }
  async countTimers(channel, chatter) {
    Object.keys(this.timers).forEach(async (element) => {
      var that = this;
      var incrMsg = 1;
      switch (element) {
        case "follower":
          await this.isFollowing(channel, chatter)
            .then((result) => {
              if (result) incrMsg = this.timers[element].msgValue;
            })
            .catch((error) => {
              console.error("Too fast requests, didnt get answer from API");
            });
          break;
        case "sub":
          //TODO Sub timer
          break;
        case "cheer":
          //TODO cheer timer / donation?
          break;
        default:
        // console.log("I count normal timer");
      }
      this.timers[element].msgCount += incrMsg;
    });
  }
  async checkTimersInterval(client, channel) {
    var that = this;
    //for now like this
    let timer_interval = setInterval(async function checkTimers() {
      let chckDate = new Date();
      chckDate = `${chckDate.getHours()}:${chckDate.getMinutes()}:${chckDate.getSeconds()}`;
      console.log(clc.info("Checking "), clc.notice(chckDate));

      Object.keys(that.timers).forEach(async (element) => {
        console.log(
          clc.info(element),
          ":",
          clc.notice(that.timers[element].msgCount)
        );
        let enabled = that.timers[element].enabled;
        let moreThanMinMsg =
          that.timers[element].msgCount >= that.timers[element].minMsg;

        if (enabled && moreThanMinMsg) {
          switch (element) {
            case "follower":
              await that.getRandomFollower(channel).then((result) => {
                client.say(
                  channel,
                  that.returnFollowMsg(result.followed_at, result.from_name)
                );
              });
              break;
            default:
              client.say(channel, that.returnNormalMsg(that.timers[element]));
          }
          that.timers[element].enabled = false; // set timer for false
          that.timers[element].msgCount = 0; // reset msgs count to 0, because msg is sent

          setTimeout(function () {
            that.timers[element].enabled = true; // set time true after period of time(delay)
            console.log(
              clc.notice("TIMER:"),
              clc.info(element.toUpperCase()),
              clc.notice("- is up again")
            );
          }, that.timers[element].delay * 1000); // set timeout(f(), delay timer);
        }
      });
    }, this.delay);
    return timer_interval;
  }
}
module.exports = BotTimer;

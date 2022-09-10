var clc = require("./cli_color.js");
const TwApi = require("./twApi.js");

class BotTimer {
  constructor(commands) {
    this.cmds = commands;
    this.timers = this.cmds.timers;
    this.triggers = this.cmds.triggers;
    this.delay = this.cmds.delay * 1000;
    this.twApi = new TwApi(process.env.client_id, process.env.client_secret);
  }
  checkTriggers(client, channel, msg) {
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

    if (!choosenPhrase.format.includes("date")) follow_date = "";
    if (choosenPhrase.format.includes("date diff")) {
      follow_date = diffDays;
    }
    if (choosenPhrase.format.includes("date only")) {
      follow_date = follow_date.split(" ")[0];
    }
    if (choosenPhrase.format.includes("date time")) {
      follow_date = follow_date.split(" ")[1];
    }
    if (choosenPhrase.format.includes("date days")) {
      //TODO days
    }
    if (choosenPhrase.format.includes("date hours")) {
      //TODO hours
    }
    if (choosenPhrase.format.includes("date minutes")) {
      //TODO minutes
    }
    if (choosenPhrase.format.includes("date seconds")) {
      //TODO seconds
    }

    msg = `${choosenPhrase.phrases[0]} ${name} ${choosenPhrase.phrases[1]} ${follow_date}
      ${choosenPhrase.phrases[2]}`;
    return msg;
  }
  returnNormalMsg(from) {
    var random = Math.floor(Math.random() * from.phrases.length);
    return from.phrases[random];
  }
  async countTimers(channel, chatter) {
    Object.keys(this.timers).forEach(async (element) => {
      var that = this;
      var incrMsg = 1;
      switch (element) {
        case "follower":
          await this.twApi
            .isFollowing(channel, chatter)
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
    //FIXME for now like this
    let timer_interval = setInterval(async function checkTimers() {
      let chckDate = new Date();
      chckDate = `${chckDate.getHours()}:${chckDate.getMinutes()}:${chckDate.getSeconds()}`;
      // console.log(clc.info("Checking "), clc.notice(chckDate));

      Object.keys(that.timers).forEach(async (element) => {
        // console.log(
        //   clc.info(element),
        //   ":",
        //   clc.notice(that.timers[element].msgCount)
        // );
        let enabled = that.timers[element].enabled;
        let moreThanMinMsg =
          that.timers[element].msgCount >= that.timers[element].minMsg;

        if (enabled && moreThanMinMsg) {
          switch (element) {
            case "follower":
              await that.twApi.getRandomFollower(channel).then((result) => {
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

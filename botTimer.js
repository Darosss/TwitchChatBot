const TwitchApi = require("node-twitch").default;
var clc = require("./cli_color.js");
// TODO REpair error with double msgs followers etc
class BotTimer {
  constructor(commands) {
    this.cmds = commands;
    this.timers = this.cmds.timers;
    this.triggers = this.cmds.triggers;
    this.msgs_count = [];
    this.twApi = new TwitchApi({
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
    });
    Object.keys(this.timers).forEach((element) => {
      this.msgs_count[element] = 0;
    });
    // SET EVERY MSG COUNT TO 0 WHEN STARTING BOT
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
    let date;
    if (follow_date.length > 0) {
      let follow_at = follow_date.split("T")[0].split("-");
      date = new Date(follow_at[0], follow_at[1], follow_at[2]);
    }
    const diffTime = Math.abs(new Date() - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let lenKeys = Object.keys(follow_tim.phrases).length - 1;
    let rand = Math.floor(Math.random() * lenKeys);
    let randKey = Object.keys(follow_tim.phrases)[rand];
    let choosenPhrase = follow_tim.phrases[randKey];
    let msg = "";
    if (choosenPhrase.dateDiff) follow_date = diffDays;

    msg = `${choosenPhrase[0]} ${name} ${choosenPhrase[1]} ${follow_date}
      ${choosenPhrase[2]}`;
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
  async checkNormalTimer(client, channel, chatter) {
    // loop throu config.options.timers...
    Object.keys(this.timers).forEach(async (element) => {
      var that = this;
      var incrMsg = 1;
      switch (element) {
        case "follower":
          await this.isFollowing(channel, chatter).then((result) => {
            if (result) incrMsg = this.timers[element].msgValue;
          });
          break;
        //TODO other switches: subs cheers etc idk
        default:
        // console.log("Zliczam normalnego timersa");
      }
      if (
        this.timers[element].enabled &&
        this.msgs_count[element] >= this.timers[element].minMsg
      ) {
        if (element == "follower") {
          await this.getRandomFollower(channel).then((result) => {
            client.say(
              channel,
              this.returnFollowMsg(result.followed_at, result.from_name)
            );
          });
        } // TODO other else is for subs/ cheers and donation if can
        else {
          client.say(channel, this.returnNormalMsg(this.timers[element]));
        }
        this.timers[element].enabled = false; // set timer for false
        this.msgs_count[element] = 0; // reset msgs count to 0, because msg is sent

        setTimeout(function () {
          that.timers[element].enabled = true; // set time true after period of time(delay)
          console.log(
            clc.notice("TIMER:"),
            clc.info(element.toUpperCase()),
            clc.notice("- is up again")
          ); // debug info
        }, that.timers[element].delay * 1000); // set timeout(f(), delay timer);
      }
      this.msgs_count[element] += incrMsg;
    });
    // console.log("COUNTERS: ", this.msgs_count);

    //   // --------------------------THATS DEBUG -------------------------------
    //   // else {
    //   //   if (
    //   //     !this.timers[element].enabled &&
    //   //     this.msgs_count[element] >= this.timers[element].msg
    //   //   ) {
    //   //     console.log(
    //   //       element,
    //   //       "is false, but messages are fine: counted:",
    //   //       this.msgs_count[element],
    //   //       "min:",
    //   //       this.timers[element].msg
    //   //     );
    //   //   } else if (
    //   //     this.timers[element].enabled &&
    //   //     !this.msgs_count[element] >= this.timers[element].msg
    //   //   ) {
    //   //     console.log(
    //   //       element,
    //   //       "is enabled, but messages aren't high enough counted:",
    //   //       this.msgs_count[element],
    //   //       "min:",
    //   //       this.timers[element].msg
    //   //     );
    //   //   } else {
    //   //     console.log("Nothing is true so do nothing");
    //   //   }
    //   // }
    //   // --------------------------THATS DEBUG -------------------------------
    // }
    //checkTimerApi for taking data from json api fe. data,
    //random name follower etc(is following)
  }
}
module.exports = BotTimer;

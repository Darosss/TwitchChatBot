var clc = require("./cli_color.js");
const TwApi = require("./twApi.js");
class BotTimer {
  constructor(commands) {
    this.twApi = new TwApi(process.env.client_id, process.env.client_secret);
    this.cmds = commands;
    this.timers = this.cmds.timers;
    this.triggers = this.cmds.triggers;
    this.chatGames = new chatGames(this.cmds.chatGames);
    this.gameStage = 0;
    this.delay = this.cmds.delay * 1000;
    this.activeTime = this.cmds.activeTime;
    this.minUsersGame = this.cmds.minUsersGame;
    this.activeUsers = new Map();
  }
  checkTriggers(client, channel, msg) {
    Object.keys(this.triggers).forEach((element) => {
      let trigger = this.triggers[element];
      let trigger_word = trigger.trigger;
      if (trigger.enabled) {
        if (msg.toLowerCase().includes(trigger_word)) {
          this.triggers[element].enabled = false;
          client.say(channel, trigger.msg);
          setTimeout(() => {
            console.log(
              clc.notice("TRIGGER:"),
              clc.info(element.toUpperCase()),
              clc.notice("- is up again")
            );
            this.triggers[element].enabled = true;
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
    let timer_interval = setInterval(async () => {
      let chckDate = new Date();
      chckDate = `${chckDate.getHours()}:${chckDate.getMinutes()}:${chckDate.getSeconds()}`;
      // console.log(clc.info("Checking "), clc.notice(chckDate));

      Object.keys(this.timers).forEach(async (element) => {
        let enabled = this.timers[element].enabled;
        let moreThanMinMsg =
          this.timers[element].msgCount >= this.timers[element].minMsg;

        if (enabled && moreThanMinMsg) {
          switch (element) {
            case "follower":
              await this.twApi.getRandomFollower(channel).then((result) => {
                client.say(
                  channel,
                  this.returnFollowMsg(result.followed_at, result.from_name)
                );
              });
              break;
            default:
              client.say(channel, this.returnNormalMsg(this.timers[element]));
          }
          this.timers[element].enabled = false; // set timer for false
          this.timers[element].msgCount = 0; // reset msgs count to 0, because msg is sent

          setTimeout(() => {
            this.timers[element].enabled = true; // set time true after period of time(delay)
            console.log(
              clc.notice("TIMER:"),
              clc.info(element.toUpperCase()),
              clc.notice("- is up again")
            );
          }, this.timers[element].delay * 1000); // set timeout(f(), delay timer);
        }
      });
    }, this.delay);
    return timer_interval;
  }
  addActiveUser(username) {
    let msgTime = new Date();
    this.activeUsers.set(username, msgTime);
    console.log("active users:", this.activeUsers);
  }
  checkActiveUsers() {
    // console.log("Check active users");
    this.activeUsers.forEach((values, keys) => {
      console.log(values, keys);
      const diffTime = Math.abs(new Date() - values);
      const diffSeconds = Math.ceil(diffTime / 1000);
      if (diffSeconds > this.activeTime) {
        console.log(
          clc.notice("User:"),
          clc.name(keys),
          clc.notice("is not active anymore after"),
          diffSeconds,
          clc.notice("seconds")
        );
        this.activeUsers.delete(keys);
      }
    });
  }
  // randomChatGame(){
  //  this.checkActiveUsers();
  //}
  async chatGameMialcznik(client, channel) {
    this.checkActiveUsers();
    // if (this.activeUsers.size < this.minUsersGame) return;
    // let gameKeys = Object.keys(this.chatGames);
    // var randKey = Math.floor(Math.random() * gameKeys.length);
    // let chatGameKeys = Object.keys(this.chatGames[gameKeys[randKey]]);
    // console.log(this.chatGames.mialcznik[chatGameKeys[this.gameStage]]);
    this.chatGames.startGame();
    this.gameStage = 0;
  }
}
class chatGames {
  constructor(games) {
    this.games = games;
    this.easyGames = this.games.easyGames;
    this.advancedGames = this.games.advancedGames;
    this.easyGamesObj = new easyGame(this.easyGames);
    this.advancedGamesObj = new advancedGame(this.advancedGames);
  }

  getTypeOfGame() {
    let typeKeys = Object.keys(this.games);
    let randType = Math.floor(Math.random() * typeKeys.length);
    return typeKeys[randType];
  }
  getRandomGame() {
    let typeOfGame = this.getTypeOfGame();
    switch (typeOfGame) {
      case "easyGames":
        this.easyGamesObj.getRandomGame();
        console.log("easy wybrano", this.easyGamesObj.getRandomGame());
        this.startEasyGame();
        break;
      case "advancedGames":
        console.log("advanc wybrano", this.advancedGamesObj.getRandomGame());
        this.startAdvancedGame();
        break;
      default:
        break;
    }
    // let gameKeys = Object.keys(typeOfGame);
    // let randGame = Math.floor(Math.random() * gameKeys.length);
    // console.log("kek", typeOfGame[gameKeys[randGame]]);
  }

  startGame() {
    this.getRandomGame();
  }
  startEasyGame() {
    console.log("STARTED EASY");
    //TODO easy game rule:
    // Take startGame phrase and wait x time
    // Get random active user and paste foundUser phrase
    // if answer answered
    // if not notAnswered
    // sth like this
  }
  startAdvancedGame() {
    console.log("STARTED ADVANC");
  }
}
class easyGame {
  constructor(sequences) {
    this.seq = sequences;
  }

  getRandomGame() {
    let gameKeys = Object.keys(this.seq);
    let randGame = Math.floor(Math.random() * gameKeys.length);
    let choosenGame = this.seq[gameKeys[randGame]];
    return choosenGame;
  }
}
class advancedGame {
  constructor(sequences) {}

  getRandomGame() {}
}
module.exports = BotTimer;

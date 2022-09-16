var clc = require("./cli_color.js");
const TwApi = require("./twApi.js");

//TODO do other advanced games maybe? or jsut try to implement this to stream next time?
class BotTimer {
  constructor(client, commands) {
    this.client = client;
    this.twApi = new TwApi(process.env.client_id, process.env.client_secret);
    this.cmds = commands;
    this.timers = this.cmds.timers;
    this.triggers = this.cmds.triggers;
    this.games = this.cmds.chatGames;
    this.maxActiveUserTime = this.cmds.maxActiveUserTime;
    this.activeUsers = new Map();
    this.chatGamesObj = new ChatGames(client, this.games, this.activeUsers);
    this.delay = this.cmds.checkTimersDelay * 1000;
    this.minActiveUsers = this.cmds.minActiveUsers;
    this.checkChatGamesDelay = this.cmds.checkChatGamesDelay * 1000;
  }
  initOnMessage(client, channel, message, username) {
    this.#addActiveUser(username);
    this.#checkTriggers(client, channel, message);
    this.#countTimers(channel.slice(1), username);
  }
  initOnJoinToChannel(channel) {
    this.#checkTimersInterval(channel);
    this.#checkChatGamesInterval();
  }

  #checkTriggers(client, channel, msg) {
    Object.keys(this.triggers).forEach((element) => {
      let trigger = this.triggers[element];
      let trigger_word = trigger.trig_word;
      if (trigger.enabled && msg.toLowerCase().includes(trigger_word)) {
        this.triggers[element].enabled = false;
        client.say(channel, trigger.msg);
        this.#timeoutTrigger(element);
      }
    });
  }
  #timeoutTrigger(trigger) {
    setTimeout(() => {
      console.log(
        clc.notice("TRIGGER:"),
        clc.info(trigger.toUpperCase()),
        clc.notice("- is up again")
      );
      this.triggers[trigger].enabled = true;
    }, this.triggers[trigger].delay * 1000);
  }
  #returnFollowMsg(follow_date = "", name = "") {
    let timerFollow = this.timers.follower;
    let lenKeys = Object.keys(timerFollow.phrases).length - 1;
    let rand = Math.floor(Math.random() * lenKeys);
    let randKey = Object.keys(timerFollow.phrases)[rand];
    let choosenPhrase = timerFollow.phrases[randKey];
    follow_date = this.#formatFollowDate(choosenPhrase.format, follow_date);
    let returnMsg = "";

    returnMsg = `${choosenPhrase.phrases[0]} ${name} ${choosenPhrase.phrases[1]} ${follow_date}
      ${choosenPhrase.phrases[2]}`;
    return returnMsg;
  }
  #formatFollowDate(format, date) {
    if (!format.includes("date")) return "";
    date = date.replace("T", " ").replace("Z", "");
    const diffTime = Math.abs(new Date() - new Date(date));
    const diffMs = diffTime;

    if (format.includes("date")) date = date.split(" ")[0];
    else if (format.includes("date time")) date = date.split(" ")[1];
    else if (format.includes("date days")) {
      date = Math.ceil(diffMs / 1000 / 60 / 60 / 24) + " days ";
    } else if (format.includes("date hours")) {
      date = Math.ceil(diffMs / 1000 / 60 / 60) + " hours ";
    } else if (format.includes("date minutes")) {
      date = Math.ceil(diffMs / 1000 / 60) + " minutes ";
    } else if (format.includes("date seconds")) {
      date = Math.ceil(diffMs / 1000) + " seconds ";
    } else if (format.includes("date miliseconds")) {
      date = Math.ceil(diffMs) + " miliseconds ";
    }
    return date;
  }
  #returnNormalMsg(from) {
    var random = Math.floor(Math.random() * from.phrases.length);
    return from.phrases[random];
  }
  async #countTimers(channel, chatter) {
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
  #resetTimer(timer) {
    this.timers[timer].enabled = false;
    this.timers[timer].msgCount = 0;
  }
  #timeoutTimer(timer) {
    setTimeout(() => {
      this.timers[timer].enabled = true; // set time true after period of time(delay)
      console.log(
        clc.notice("TIMER:"),
        clc.info(timer.toUpperCase()),
        clc.notice("- is up again")
      );
    }, this.timers[timer].delay * 1000); // set timeout(f(), delay timer);}
  }
  async #checkTimersInterval(channel) {
    setInterval(async () => {
      let chckDate = new Date();
      chckDate = `${chckDate.getHours()}:${chckDate.getMinutes()}:${chckDate.getSeconds()}`;
      Object.keys(this.timers).forEach(async (timer) => {
        let enabled = this.timers[timer].enabled;
        let moreThanMinMsg =
          this.timers[timer].msgCount >= this.timers[timer].minMsgValue;
        if (enabled && moreThanMinMsg) {
          switch (timer) {
            case "follower":
              await this.twApi.getRandomFollower(channel).then((result) => {
                this.client.say(
                  channel,
                  this.#returnFollowMsg(result.followed_at, result.from_name)
                );
              });
              break;
            default:
              this.client.say(
                channel,
                this.#returnNormalMsg(this.timers[timer])
              );
          }
          this.#resetTimer(timer);
          this.#timeoutTimer(timer);
        }
      });
    }, this.delay);
  }
  #addActiveUser(username) {
    this.activeUsers.set(username, new Date());
  }
  #checkActiveChatUsers() {
    this.activeUsers.forEach((values, keys) => {
      const diffTime = Math.abs(new Date() - values);
      const diffSeconds = Math.ceil(diffTime / 1000);
      if (diffSeconds > this.maxActiveUserTime) {
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
  #checkChatGamesInterval() {
    setInterval(() => {
      this.#checkActiveChatUsers();
      if (this.activeUsers.size >= this.minActiveUsers) {
        this.chatGamesObj.startGameIfAvailable();
        return;
      }
    }, this.checkChatGamesDelay);
  }
}
class ChatGames {
  constructor(client, games, activeUsers) {
    this.games = games;
    this.options = this.games.options;
    this.gamesList = this.games.gamesList;
    this.easyGames = this.gamesList.easyGames;
    this.easyGamesObj = new EasyGame(client, this.easyGames, this.options);
    this.timeBetweenGames = this.options.timeBetweenGames;
    this.activeUsers = activeUsers;
  }
  checkTimeBetweenGames() {
    let lastGameDate = this.options.lastTimeEnded;
    if (isNaN(lastGameDate)) return true;
    const diffTime = Math.abs(new Date() - lastGameDate);
    const diffSeconds = Math.ceil(diffTime / 1000);
    if (diffSeconds > this.timeBetweenGames) return true;
  }
  startGameIfAvailable() {
    // console.log(clc.msg("Checking if game can be started"));
    if (!this.checkTimeBetweenGames()) return;
    this.startRandomGame();
  }
  isGameEnabled() {
    if (this.options.enabled) return true;
    this.options.pendingGame = "";
    return false;
  }
  isGameChoosen() {
    if (this.options.pendingGame.length > 1) return true;
    return false;
  }
  getTypeOfGame() {
    let typeKeys = Object.keys(this.gamesList);
    let randType = Math.floor(Math.random() * typeKeys.length);
    return typeKeys[randType];
  }
  startRandomGame() {
    if (!this.isGameEnabled()) return;
    if (this.isGameChoosen()) return;

    this.options.pendingGame = this.getTypeOfGame();
    switch (this.options.pendingGame) {
      case "easyGames":
        this.options.pendingGame = "easyGames";
        this.easyGamesObj.startEasyGame(this.activeUsers);
        console.log(
          "Choosen game-easy game(this should be logged once per session game)"
        );
        break;
      default:
        console.log("No game found - break");
        break;
    }
  }
}
class EasyGame {
  constructor(client, easyGamesList, options) {
    this.client = client;
    this.gamesList = easyGamesList;
    this.options = options;
    this.choosenGame = "";
    this.stages = this.options.easyGamesStages;
    this.actualStage = this.options.actualStage;
    this.onMsg;
    this.channel = this.client.opts.channels[0].slice(1);
    this.waitForAnswer = this.options.waitForAnswer * 1000;
    this.gameTimeout;
    this.gameMs = this.options.gameMs * 1000;
    this.activeUsers;
  }
  setRandomGame() {
    let gameKeys = Object.keys(this.gamesList);
    let randGame = Math.floor(Math.random() * gameKeys.length);
    this.choosenGame = this.gamesList[gameKeys[randGame]];
  }

  setTimeoutGameStage(stage, delay = this.gameMs) {
    console.log("Timeout should work");
    this.gameTimeout = setTimeout(() => {
      stage();
    }, delay);
  }
  startEasyGame(activeUsers) {
    console.log("Easy game started");
    this.activeUsers = activeUsers;
    this.setRandomGame();
    this.options.lastTimeEnded = new Date();
    this.setTimeoutGameStage(this.startGameStage.bind(this));
  }
  clearGameTimeout() {
    console.log("Clearing game timeout");
    if (this.gameTimeout) {
      clearTimeout(this.gameTimeout);
    }
  }
  checkMsgForAnswers(msg) {
    this.choosenGame.answersList.every((answer) => {
      if (msg.includes(answer)) {
        console.log("Good answer, pass");
        this.actualStage = this.stages[2];
        this.answeredStage();
        return false;
      }
      return true;
    });
  }
  chooseRandomActiveUser() {
    let activeUsers = Array.from(this.activeUsers);
    return activeUsers[Math.floor(Math.random() * activeUsers.length)][0];
  }
  startGameStage() {
    this.client.say(this.channel, this.choosenGame[this.stages[0]]);
    console.log("START MESSAGE", this.choosenGame[this.stages[0]]);
    this.actualStage = this.stages[1];
    this.setTimeoutGameStage(this.checkForAnswerStage.bind(this));
  }

  checkForAnswerStage() {
    console.log(clc.notice(this.choosenGame[this.stages[1]]));
    let answerMsg =
      this.choosenGame[this.stages[1]][0] +
      this.chooseRandomActiveUser() +
      this.choosenGame[this.stages[1]][1];

    this.client.say(this.channel, answerMsg);
    this.onMsg = this.client.on("message", (channel, tags, message, self) => {
      if (self) return;
      if (channel != this.channel) return;
      this.checkMsgForAnswers(message);
    });
    this.setTimeoutGameStage(
      this.notAnsweredStage.bind(this),
      this.waitForAnswer
    );
  }
  answeredStage() {
    this.clearGameTimeout();
    console.log("Answred....END OF THE GAME");
    this.client.say(this.channel, this.choosenGame[this.stages[2]]);
    console.log("ANSWERED MESSAGE", this.choosenGame[this.stages[2]]);

    this.endGameStage();
  }
  notAnsweredStage() {
    console.log("not answered....END OF THE GAME");
    this.client.say(this.channel, this.choosenGame[this.stages[3]]);
    console.log("NOT ANSWERED MESSAGE", this.choosenGame[this.stages[3]]);
    this.endGameStage();
  }
  endGameStage() {
    //clear variables for now/ dunno if needed
    this.actualStage = "";
    this.onMsg = "";
    this.options.pendingGame = "";
  }
}

module.exports = BotTimer;

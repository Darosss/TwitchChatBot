var clc = require("./cli_color.js");
const TwApi = require("./twApi.js");
const CHANNEL_DEBUG = "#booksarefunsometimes";

//TODO do other advanced games maybe? or jsut try to implement this to stream next time?
class BotTimer {
  constructor(client, commands) {
    this.client = client;
    this.twApi = new TwApi(process.env.client_id, process.env.client_secret);
    this.cmds = commands;
    this.timers = this.cmds.timers;
    this.triggers = this.cmds.triggers;
    this.games = this.cmds.chatGames;
    this.activeTime = this.cmds.activeTime;
    this.activeUsers = new Map();
    this.chatGamesObj = new ChatGames(client, this.games, this.activeUsers);
    this.delay = this.cmds.delay * 1000;
  }
  initOnMessage(client, channel, message, username) {
    this.addActiveUser(username);
    this.checkTriggers(client, channel, message);
    this.countTimers(channel.slice(1), username);
  }
  timeoutTrigger(trigger) {
    setTimeout(() => {
      console.log(
        clc.notice("TRIGGER:"),
        clc.info(trigger.toUpperCase()),
        clc.notice("- is up again")
      );
      this.triggers[trigger].enabled = true;
    }, this.triggers[trigger].delay * 1000);
  }
  checkTriggers(client, channel, msg) {
    Object.keys(this.triggers).forEach((element) => {
      let trigger = this.triggers[element];
      let trigger_word = trigger.trig_word;
      if (trigger.enabled && msg.toLowerCase().includes(trigger_word)) {
        this.triggers[element].enabled = false;
        client.say(channel, trigger.msg);
        this.timeoutTrigger(element);
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
    //TODO funkcje format
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
  //TODO change add active user to channels example: usechapter999 and booksarefunsometimes have another active users
  addActiveUser(username) {
    let msgTime = new Date();
    this.activeUsers.set(username, msgTime);
    console.log("active users:", this.activeUsers);
  }
  checkActiveUsers() {
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
  async checkChatGames() {
    this.checkActiveUsers();

    //uncomment its for start game when more than x users are 'active'
    if (this.games.options.pendingGame.length > 0) return;
    this.chatGamesObj.intervalCheckGame();
    // this.chatGames.startRandomGame();
  }
}
class ChatGames {
  constructor(client, games, activeUsers) {
    this.games = games;
    this.options = this.games.options;
    this.gamesList = this.games.gamesList;
    this.easyGames = this.gamesList.easyGames;
    this.activeUsers = activeUsers;
    this.minActiveUsers = this.options.minActiveUsers;
    this.easyGamesObj = new EasyGame(
      client,
      this.easyGames,
      this.options,
      activeUsers
    );
    this.timeBetweenGames = this.options.timeBetweenGames;
    this.checkGamesMs = this.options.checkGamesMs * 1000;
  }
  checkTimeBetweenGames() {
    let lastGameDate = this.options.lastTimeEnded;
    if (isNaN(lastGameDate)) return true;
    const diffTime = Math.abs(new Date() - lastGameDate);
    const diffSeconds = Math.ceil(diffTime / 1000);

    console.log(
      "seconds",
      diffSeconds,
      this.options.pendingGame,
      this.options.enabled
    );
    if (diffSeconds > this.timeBetweenGames) return true;
  }
  intervalCheckGame() {
    setInterval(() => {
      console.log(clc.msg("Checking if game can be started"));
      if (this.activeUsers.size < this.minActiveUsers) return;
      if (!this.checkTimeBetweenGames()) return;

      //TODO % or static time between games
      this.startRandomGame();
    }, this.checkGamesMs);
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
        this.easyGamesObj.startEasyGame();
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
  constructor(client, easyGamesList, options, activeUsers) {
    this.client = client;
    this.gamesList = easyGamesList;
    this.options = options;
    this.choosenGame = "";
    this.stages = this.options.easyGamesStages;
    this.actualStage = this.options.actualStage;
    this.onMsg;
    this.waitForAnswer = this.options.waitForAnswer * 1000;
    this.gameTimeout;
    this.gameMs = this.options.gameMs * 1000;
    this.activeUsers = activeUsers;
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
  startEasyGame() {
    console.log("Easy game started");
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
    this.client.say(CHANNEL_DEBUG, this.choosenGame[this.stages[0]]);
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

    this.client.say(CHANNEL_DEBUG, answerMsg);
    this.onMsg = this.client.on("message", (channel, tags, message, self) => {
      if (self) return;
      if (channel != CHANNEL_DEBUG) return;
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
    this.client.say(CHANNEL_DEBUG, this.choosenGame[this.stages[2]]);
    console.log("ANSWERED MESSAGE", this.choosenGame[this.stages[2]]);

    this.endGameStage();
  }
  notAnsweredStage() {
    console.log("not answered....END OF THE GAME");
    this.client.say(CHANNEL_DEBUG, this.choosenGame[this.stages[3]]);
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

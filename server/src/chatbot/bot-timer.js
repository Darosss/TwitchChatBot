const TwApi = require("../twitch-api");

//TODO do other advanced games maybe? or jsut try to implement this to stream next time?
class BotTimer {
  constructor(client, commands) {
    this.client = client;
    this.twApi = new TwApi(process.env.client_id, process.env.client_secret);
    this.cmds = commands;
    this.timers = this.cmds.timers;
    this.triggers = this.cmds.triggers;
    this.noTriggerMsg = this.cmds.noTriggerMsg;
    this.games = this.cmds.chatGames;
    this.maxActiveUserTime = this.cmds.maxActiveUserTime;
    this.activeUsers = new Map();
    this.chatGamesObj = new ChatGames(client, this.games, this.activeUsers);
    this.delay = this.cmds.checkTimersDelay * 1000;
    this.minActiveUsers = this.cmds.minActiveUsers;
    this.checkChatGamesDelay = this.cmds.checkChatGamesDelay * 1000;
    this.timersInterval;
    this.chatGamesInterval;
  }
  initOnMessage(client, channel, message, username) {
    this.#addActiveUser(username);
    this.#checkTriggers(client, channel, message);
    this.#countTimers(channel.slice(1), username);
  }
  initOnJoinToChannel(channel) {
    if (this.timersInterval) clearInterval(this.timersInterval);
    if (this.chatGamesInterval) clearInterval(this.chatGamesInterval);
    this.#checkTimersInterval(channel);
    this.#checkChatGamesInterval();
  }

  #checkTriggers(client, channel, msg) {
    let foundAtLeastOne = false;
    Object.keys(this.triggers).forEach((element) => {
      let trigger = this.triggers[element];
      let triggerChance = trigger.chance;

      let trigger_word = trigger.trig_word;

      if (
        trigger.enabled &&
        this.#checkIfMsgContainsTriger(msg.toLowerCase(), trigger_word) &&
        this.#triggerChance(triggerChance)
      ) {
        this.triggers[element].enabled = false;
        foundAtLeastOne = true;

        let trigerMsgToSend = this.#getRandomMessageTrigger(trigger.msg);
        console.log(channel, trigerMsgToSend);

        client.say(channel, trigerMsgToSend).catch((error) => {
          console.log("Send msg err");
        });

        this.#timeoutTrigger(element);
      }
    });

    if (!foundAtLeastOne && this.#triggerChance(this.noTriggerMsg.chance)) {
      let noTriggerMsgSend = this.#getRandomMessageTrigger(
        this.noTriggerMsg.msg
      );

      client.say(channel, noTriggerMsgSend).catch((error) => {
        console.log("Send msg err");
      });
    }
  }

  #getRandomMessageTrigger(msgs) {
    let rand = Math.floor(Math.random() * msgs.length);
    return msgs[rand];
  }

  #checkIfMsgContainsTriger(msg, triggers) {
    let msgContainsTriger = false;
    for (let i = 0; i < triggers.length; i++) {
      if (msg.includes(triggers[i].toLowerCase())) {
        return true;
      }
    }
    return msgContainsTriger;
  }

  #triggerChance(percent) {
    let chance = Math.random() * 100;
    console.log("chance", chance, "percent", percent);
    if (chance < percent) return true;
  }

  #timeoutTrigger(trigger) {
    setTimeout(() => {
      console.log("TRIGGER:", trigger.toUpperCase(), "- is up again");
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
      console.log("TIMER:", timer.toUpperCase(), "- is up again");
    }, this.timers[timer].delay * 1000); // set timeout(f(), delay timer);}
  }

  async #sendTimersIfAvailable(channel) {
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
            this.client.say(channel, this.#returnNormalMsg(this.timers[timer]));
        }
        this.#resetTimer(timer);
        this.#timeoutTimer(timer);
      }
    });
  }

  #checkTimersInterval(channel) {
    this.timersInterval = setInterval(() => {
      let chckDate = new Date();
      chckDate = `${chckDate.getHours()}:${chckDate.getMinutes()}:${chckDate.getSeconds()}`;

      this.#sendTimersIfAvailable(channel);
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
          "User:",
          keys,
          "is not active anymore after",
          diffSeconds,
          "seconds"
        );
        this.activeUsers.delete(keys);
      }
    });
  }

  #checkChatGamesInterval() {
    this.chatGamesInterval = setInterval(() => {
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
    this.selectionGames = this.gamesList.selectionGames;
    this.easyGamesObj = new EasyGame(client, this.easyGames, this.options);
    this.selectionGamesObj = new SelectionGame(
      client,
      this.selectionGames,
      this.options
    );
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
    console.log("Choosen game", this.options.pendingGame);
    switch (this.options.pendingGame) {
      case "easyGames":
        this.options.pendingGame = "easyGames";
        this.easyGamesObj.startEasyGame(this.activeUsers);
        console.log(
          "Choosen game-easy game(this should be logged once per session game)"
        );
        break;
      case "selectionGames": {
        this.options.pendingGame = "selectionGames";
        this.selectionGamesObj.startSelectGame(this.activeUsers);
        break;
      }
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
    let randomActiveUser = this.chooseRandomActiveUser();
    console.log(this.choosenGame[this.stages[1]]);
    let answerMsg =
      this.choosenGame[this.stages[1]][0] +
      randomActiveUser +
      this.choosenGame[this.stages[1]][1];

    this.client.say(this.channel, answerMsg);
    this.client.on("message", (channel, tags, message, self) => {
      if (self) return;
      if (tags.username != randomActiveUser) return;
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
    this.actualStage = "";
    this.onMsg = "";
    this.options.pendingGame = "";
  }
}
class SelectionGame {
  constructor(client, selectionGamesList, options) {
    this.client = client;
    this.gamesList = selectionGamesList;
    this.options = options;
    this.choosenGame = "";
    this.actualStage;
    this.channel = this.client.opts.channels[0].slice(1);
    this.waitForAnswer = this.options.waitForAnswer * 1000;
    this.gameTimeout;
    this.gameMs = this.options.gameMs * 1000;
    this.activeUsers;
    this.choosenRandomUser;
    this.checkChoiceOnMsg();
  }

  setRandomChoicesGame() {
    let gameKeys = Object.keys(this.gamesList);
    let randGame = Math.floor(Math.random() * gameKeys.length);
    this.choosenGame = this.gamesList[gameKeys[randGame]];
    this.actualStage = this.choosenGame["choices"];
  }

  startSelectGame(activeUsers) {
    console.log("Select game started");
    this.activeUsers = activeUsers;
    this.setRandomChoicesGame();
    this.options.lastTimeEnded = new Date();
    this.choosenRandomUser = this.chooseRandomActiveUser();
    this.startGameStage();
  }

  checkMsgForChoice(msg) {
    if (!this.actualStage) return;

    Object.keys(this.actualStage).every((answer) => {
      if (msg.includes(answer)) {
        this.actualStage = this.actualStage[msg];

        this.startGameStage();
        return false;
      }
      return true;
    });
  }

  checkChoiceOnMsg() {
    this.onMsg = this.client.on("message", (channel, tags, message, self) => {
      if (self) return;
      if (tags.username != this.choosenRandomUser) return;
      this.checkMsgForChoice(message);
    });
  }

  chooseRandomActiveUser() {
    let activeUsers = Array.from(this.activeUsers);
    return activeUsers[Math.floor(Math.random() * activeUsers.length)][0];
  }

  startGameStage() {
    setTimeout(() => {
      this.client.say(this.channel, this.actualStage["description"]);

      setTimeout(() => {
        if (this.actualStage["choicesDesc"]) {
          this.client.say(this.channel, this.actualStage["choicesDesc"]);
        } else if (this.actualStage["end"]) {
          let descFinish = this.actualStage["end"]["description"];
          if (this.actualStage["end"]["finished"]) {
            setTimeout(() => {
              this.client.say(this.channel, descFinish);
            }, Math.ceil(this.gameMs / 4));
            setTimeout(() => {
              this.client.say(
                this.channel,
                this.choosenGame["endGame"]["description"]
              );
            }, Math.ceil(this.gameMs / 4));

            this.endGameStage();
          }
        }
      }, Math.ceil(this.gameMs / 3));
    }, this.gameMs / 2);
  }

  endGameStage() {
    this.actualStage = "";
    this.options.pendingGame = "";
  }
}

export default BotTimer;

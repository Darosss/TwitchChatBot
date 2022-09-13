var clc = require("./cli_color.js");
const TwApi = require("./twApi.js");

class BotTimer {
  constructor(client, commands) {
    this.client = client;
    this.twApi = new TwApi(process.env.client_id, process.env.client_secret);
    this.cmds = commands;
    this.timers = this.cmds.timers;
    this.triggers = this.cmds.triggers;
    this.games = this.cmds.chatGames;
    this.chatGames = new chatGames(client, this.games);
    //change to chatgamesobj
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
  async checkChatGames() {
    this.checkActiveUsers();
    // if (this.activeUsers.size < this.minUsersGame) return;
    //uncomment its for start game when more than x users are 'active'
    if (this.games.options.pendingGame.length > 0) return;
    this.chatGames.startIntervalGames();
  }
}
class chatGames {
  constructor(client, games) {
    this.games = games;
    this.options = this.games.options;
    this.gamesList = this.games.gamesList;
    this.easyGames = this.gamesList.easyGames;
    this.advancedGames = this.gamesList.advancedGames;
    this.waitingForAnswer;
    this.easyGamesStates = [
      "startGame",
      "foundUser",
      "answered",
      "notAnswered",
    ];
    this.stateOfGame = "";
    this.easyGamesObj = new EasyGame(
      client,
      this.easyGames,
      this.easyGamesStates,
      this.options
    );
    this.advancedGamesObj = new advancedGame(this.advancedGames);
    this.choosenGame = "";
  }
  startIntervalGames() {
    setInterval(() => {
      console.log("IM CHECKING IF GAME CAN BE STARTED or...CHECKING %");
      this.startRandomGame();
    }, this.options.waitForAnswer);
  }
  startRandomGame() {
    if (!this.options.enabled) {
      this.options.pendingGame = "";
      return;
    }
    if (this.options.pendingGame.length > 1) {
      console.log("Already choosen random type of game");
      this.playGame();
      return;
    }
    console.log(
      "Is enabled chat game:",
      this.options.enabled,
      "Pending game:",
      this.options.pendingGame,
      "onDelay:",
      this.options.onDelay
    );

    this.options.pendingGame = this.getTypeOfGame();
    switch (this.options.pendingGame) {
      case "easyGames":
        this.options.pendingGame = "easyGames";
        this.easyGamesObj.setRandomGame();
        console.log("case easyGames switch -- enabled?", this.options.enabled);
        break;
      case "advancedGames":
        // this.startAdvancedGame();
        break;
      default:
        console.log("DEFAULT bc???");
        break;
    }
  }
  playGame() {
    console.log("playGame pendingGame", this.options.pendingGame);
    switch (this.options.pendingGame) {
      case "easyGames":
        this.playEasyGame();
        break;
      // case "advGames":
      default:
        break;
    }
  }
  turnOnTimeout() {
    console.log("END OF GAME - Turned on timeout to enable again games");
    this.options.enabled = false;
    setTimeout(() => {
      console.log("Chat games are enabled again");
      this.options.enabled = true;
    }, 20000);
  }
  playEasyGame() {
    switch (this.options.actualState) {
      case this.easyGamesStates[1]:
        console.log("Start found user switch");
        this.easyGamesObj.foundUserState();

        console.log(
          "found user: changed state to - ",
          this.options.actualState
        );
        break;

      case this.easyGamesStates[2]:
        console.log("Start answered switch");
        this.easyGamesObj.answeredState();
        this.turnOnTimeout();
        console.log("ANSWERED: changed state to - ", this.options.actualState);
        break;
      case this.easyGamesStates[3]:
        console.log("Start not answered switch");
        this.easyGamesObj.notAnsweredState();
        this.turnOnTimeout();
        console.log(
          "NOTANSWERED: changed state to - empty string ",
          this.options.actualState
        );
        break;
      case "wait":
        console.log("Waiting for response");
        break;
      default:
        console.log("Start eays game switch");
        this.easyGamesObj.startEasyGame();
        console.log(
          "default - startgame: changed state to - ",
          this.options.actualState
        );
        break;
    }
  }
  getTypeOfGame() {
    let typeKeys = Object.keys(this.gamesList);
    let randType = Math.floor(Math.random() * typeKeys.length);
    return typeKeys[randType];
  }
}
class EasyGame {
  constructor(client, sequences, states, options) {
    this.client = client;
    this.seq = sequences;
    this.states = states;
    this.options = options;
    this.choosenEasyGame = "";
    this.onMsg;
    this.waitForAnswer = this.options.waitForAnswer;
    this.waitingForAnswer;
  }
  setRandomGame() {
    let gameKeys = Object.keys(this.seq);
    let randGame = Math.floor(Math.random() * gameKeys.length);
    this.choosenEasyGame = this.seq[gameKeys[randGame]];
  }
  startEasyGame() {
    console.log(clc.notice(this.choosenEasyGame[this.states[0]]));
    this.client.say(
      "#booksarefunsometimes",
      this.choosenEasyGame[this.states[0]]
    );
    this.options.actualState = this.states[1];
  }
  foundUserState() {
    console.log("Found user....");
    console.log(clc.notice(this.choosenEasyGame[this.states[1]]));
    this.client.say(
      "#booksarefunsometimes",
      this.choosenEasyGame[this.states[1]]
    );

    this.onMsg = this.client.on("message", (channel, tags, message, self) => {
      if (self) return;
      console.log("ALREADY ANSWERED and cleared timeout");
      if (message == "mialczniku chuju") {
        this.options.actualState = this.states[2];
        clearTimeout(this.waitingForAnswer);
      }
    });
    if (!this.waitingForAnswer) {
      console.log("WAUITING FOR ANSWER");
      this.waitingForAnswer = setTimeout(() => {
        console.log("Timeout ended not asnwered");

        this.options.actualState = this.states[3];
        console.log("actula state", this.options.actualState);
      }, Math.floor(this.waitForAnswer / 2));
    }
  }
  answeredState() {
    console.log("Answred....");
    console.log(clc.notice(this.choosenEasyGame[this.states[2]]));
    this.client.say(
      "#booksarefunsometimes",
      this.choosenEasyGame[this.states[2]]
    );
    this.options.actualState = "";
  }
  notAnsweredState() {
    console.log("not answered user....");
    console.log(clc.notice(this.choosenEasyGame[this.states[3]]));
    this.client.say(
      "#booksarefunsometimes",
      this.choosenEasyGame[this.states[3]]
    );
    this.options.actualState = "";
  }
}
class advancedGame {
  constructor(sequences) {}

  getRandomGame() {}
}
module.exports = BotTimer;

var config = {};

config.options = {};
config.options.channels = {};
config.options.username = "booksarefunsometimes";
config.options.oauth = "oauth";

config.options.channelsSeparately = true; //write separately folder for each of canal

config.options.folderName = "public"; //name head folder of txt
config.options.nameSentence = "sentences"; //name of sentences

config.options.channels = ["booksarefunsometimes"]; //debug
//config.options.channels = ["loltyler1", "k3soju"]; //channels to monitor
config.options.channels.pref = [""]; //prefix for channel emotes

config.options.msgLength = 0; // minimum length of message
config.options.commands = ["!"]; //not needed? leave blank ""

config.options.bots = [
  "streamelements",
  "streamlabs",
  "nightbot",
  "moobot",
  "lemonadebot_",
]; //exclude this users example. bots or broadcaster or sth
config.options.words = ["http", "@", "www.", "sub", "follow"]; // exclude words

config.options.timers = {};
config.options.timers.words = {};
// To add a trigger add new object to config.options.timers.words..fe. u want to add new trigger named shit, on triger: shit and send: you are shit:
// You create as below:
//config.options.timers.words.shit = ["shit", "you are shit"];

//									 [trigger, message, isOn?, delay in seconds];
config.options.timers.words.zabol = [
  "kappa",
  "Kappa k Kappa a Kappa p Kappa p Kappa a Kappa",
  true,
  30,
];
config.options.timers.words.lul = [
  "lul",
  "LUL k LUL a LUL p LUL p LUL a LUL",
  true,
  11,
];

config.options.timers.zabolGame = ["szukam :)", 5000];
module.exports = config;

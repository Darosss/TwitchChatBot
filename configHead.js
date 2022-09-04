var config = {};

config.options = {};
config.options.channels = {};
config.options.username = "booksarefunsometimes";

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

//CONFIG OPTIONS TIMERS:
//FOR FOLLOWS, SUBS, CHEERS
//
// [Text before data,
//  data,
//  Text before name,
//  name,
//  End text
//]
config.options.timers.follower = {};

config.options.timers.follower.phrases = [
  [
    "Long time ago when mosquitos eten tomatoen..about : ",
    " was a stupid person (",
    " ) who liked noone, but when he followed this channel he lived more than u can think about it",
  ],
  ["TAK ", " koko ", " KO"],
];

config.options.timers.follower.enabled = true;
config.options.timers.follower.delay = 10;
config.options.timers.follower.msg = 0;
config.options.timers.donation = {};
config.options.timers.donation.phrases = [
  "DONACJE TO DONAJCE DAWAJ I DONT CARE",
  "DONATION ARE ONLY FROM SONG REQUEST",
];
config.options.timers.donation.enabled = true;
config.options.timers.donation.delay = 4;
config.options.timers.donation.msg = 2;
// To add a trigger add new object to config.options.trigers..fe. u want to add new trigger named shit, on triger: shit and send: you are shit:
// You create as below:
//config.options.timers.words.shit = ["shit", "you are shit"];

//									 [trigger, message, isOn?, delay in seconds];
config.options.triggers = {};
config.options.triggers.kappa = [
  "kappa",
  "Kappa k Kappa a Kappa p Kappa p Kappa a Kappa",
  true,
  30,
];
config.options.triggers.lul = [
  "lul",
  "LUL k LUL a LUL p LUL p LUL a LUL",
  true,
  11,
];

// config.options.timers.zabolGame = ["szukam :)", 5000];
module.exports = config;

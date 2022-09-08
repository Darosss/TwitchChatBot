var config = {};

config.options = {};
config.options.channels = {};
config.options.username = "booksarefunsometimes"; // bot username

config.options.channelsSeparately = true; //write separately folder for each of canal

config.options.folderName = "public"; //name head folder of txt files
config.options.nameSentence = "sentences"; //sufix of sentences

config.options.channels = ["booksarefunsometimes"]; //channels to monitor, each separated by ' inside []

config.options.commands = ["!"]; //not needed? leave blank ""

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
config.options.timers.follower.enabled = true;
config.options.timers.follower.delay = 30;
config.options.timers.follower.msg = 15;
config.options.timers.follower.msgValue = 3;
config.options.timers.follower.phrases = {};

config.options.timers.follower.phrases.mosquito = [
  "Long time ago when mosquitos eten tomatoen..Person with name of ",
  " did the best thing in his life and followed this channel like ",
  "days ago who liked noone, but when he followed this channel he lived more than u can think about it",
];
config.options.timers.follower.phrases.mosquito.dateDiff = true;

config.options.timers.follower.phrases.another = ["TAK ", " koko ", " KO"];
config.options.timers.follower.phrases.another.dateDiff = false;

config.options.timers.follower.phrases.another1 = [
  "TUTAJ INNY ",
  " JESTEM TAK ",
  " KO",
];
config.options.timers.follower.phrases.another1.dateDiff = true;

config.options.timers.donation = {};
config.options.timers.donation.phrases = [
  "DONACJE TO DONAJCE DAWAJ I DONT CARE",
  "DONATION ARE ONLY FROM SONG REQUEST",
];
config.options.timers.donation.enabled = true;
config.options.timers.donation.delay = 1;
config.options.timers.donation.msg = 1;

config.options.timers.discord = {};
config.options.timers.discord.phrases = [
  "invite you to my discord guys ",
  "http discord com",
];
config.options.timers.discord.enabled = true;
config.options.timers.discord.delay = 20;
config.options.timers.discord.msg = 5;
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

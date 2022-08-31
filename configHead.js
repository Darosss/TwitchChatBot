var config = {};

config.options = {};
config.options.channels = {};
config.options.username="botusername";
config.options.oauth="oauth";


config.options.ignoreConditions = true;  //dodge every condition
config.options.channelsSeparately = true;  //write separately folder for each of canal
config.options.splitLetter = ";.;";  //write separately folder for each of canal

config.options.folderName = "public"; //name head folder of txt
config.options.nameSentence = "sentences"; //name of sentences
config.options.nameQuestions = "questions"; // name txt of quesitons
config.options.emotesOnly = "emotesOnly"; //name txt of emotes only

config.options.channels.arr = ["booksarefunsometimes"]; //debug
//config.options.channels.arr = ["loltyler1", "k3soju"]; //channels to monitor
config.options.channels.pref = [""]; //prefix for channel emotes

config.options.msgLength = 0; // minimum length of message
config.options.commands = ["!"]; //dodge? leave blank ""

config.options.bots = ["streamelements", "streamlabs", "nightbot", "moobot", "lemonadebot_"]; //exclude this users ex. bots
config.options.words = ["http", "@", "www.", "sub", "follow"]; // exclude words 


config.options.timers= {};
config.options.timers.words= {};
// To add a trigger add new object to config.options.timers.words..fe. u want to add new trigger named shit, on triger: shit and send: you are shit:
// You create as below:
//config.options.timers.words.shit = ["shit", "you are shit"];
//									 [trigger, message, isOn?, delay in seconds];
config.options.timers.words.zabol = ["kappa", "Kappa k Kappa a Kappa p Kappa p Kappa a Kappa", true, 120]; 
config.options.timers.words.lul = ["lul", "LUL k LUL a LUL p LUL p LUL a LUL", true, 120]; 


config.options.timers.zabolGame = ["szukam :)", 5000]
module.exports = config;
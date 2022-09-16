var config = {};

config.options = {};
config.options.channels = {};
config.options.username = "booksarefunsometimes"; // bot username

config.options.channelsSeparately = true; //write separately folder for each of canal
config.options.folderName = "public"; //name head folder of txt files
config.options.nameSentence = "sentences"; //sufix of sentences

config.options.channels = ["booksarefunsometimes"]; //channels to monitor, each separated by , inside []

config.options.commands = ["!"]; //not needed? leave blank ""

module.exports = config;

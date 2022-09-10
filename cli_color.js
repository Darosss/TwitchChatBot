var clc = require("cli-color");

let cnsColors = {
  error: clc.red.bold,
  warn: clc.redBright,
  notice: clc.blue.italic,
  info: clc.green.italic,
  msg: clc.blue.bold,
  name: clc.green.bold,
};

module.exports = cnsColors;

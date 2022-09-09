var clc = require("cli-color");

let cnsColors = {
  error: clc.red.bold,
  warn: clc.redBright,
  notice: clc.blueBright,
  info: clc.green,
};

module.exports = cnsColors;

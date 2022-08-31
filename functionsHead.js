function appendToFile(whereSave, content) {
  content += "\n";
  var fs = require("fs"),
    readline = require("readline");
  fs.appendFile(whereSave, content, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
} //(pathUserJson, which, usersJson[which], lastSeenDate)
function writeJsonData(whereSave, whichObj, lastSeen) {
  const fs = require("fs");
  const fileName = whereSave;
  const file = require(fileName);

  file[whichObj].messages++;
  file[whichObj].lastSeen = lastSeen;

  fs.writeFile(
    fileName,
    JSON.stringify(file, null, 2),
    function writeJSON(err) {
      if (err) return console.log(err);
      //console.log(JSON.stringify(file));
      //console.log('writing to ' + fileName);
    }
  );
}

module.exports = {
  appendToFile,
  writeJsonData,
};

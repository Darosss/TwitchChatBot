
function appendToFile(whereSave, content){
	content+="\n";
	var fs = require('fs'), readline = require('readline');
	fs.appendFile(whereSave, content, err => {
	  if (err) {
		console.error(err);
	  }
	  // file written successfully
	});
	
	
}//(pathUserJson, which, usersJson[which], lastSeenDate)
function writeJsonData(whereSave, whichObj, lastSeen ){
	const fs = require('fs');
	const fileName = whereSave;
	const file = require(fileName);
	
	
	file[whichObj].messages++;
	file[whichObj].lastSeen = lastSeen;

	fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
	  if (err) return console.log(err);
	  //console.log(JSON.stringify(file));
	  //console.log('writing to ' + fileName);
	});
	
}
 
function checkAndCreate(folder, file){
	const fs = require('fs');

	var dir = folder;

	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir, { recursive: true });
	}

	if (fs.existsSync(file)) {
	  // path exists
	  console.log("exists:", file);
	} else {
		fs.writeFile(file, "", function (err) {
		if (err) throw err;
			console.log('File is created successfully.');
		});
	  console.log("DOES NOT exist:", file);
	}
}
function createNewJsonUsers(userChan, userJson){
	var fs = require('fs');

	if (fs.existsSync(userJson)) {
	  // path exists
	  console.log("exists:", userJson);
	} else {
		let result = [];
		const jsonString = JSON.stringify(result);
		fs.writeFileSync(userJson, jsonString);
		userChan = require(userJson);
	  console.log("DOES NOT exist:", file);
	}
	
	
}
function checkTrigger(client, channel, msg, cond, trigerDelay){
		for(let i = 0; i < Object.keys(cond).length; i++){
			if(cond[Object.keys(cond)[i]][2]){
				console.log(cond[Object.keys(cond)[i]][0]);
				if(msg.toLowerCase().includes(cond[Object.keys(cond)[i]][0])){ 
				cond[Object.keys(cond)[i]][2] = false;
				console.log(msg);
					client.say(channel, cond[Object.keys(cond)[i]][1]);
					setTimeout(function(){
						console.log('komenda wlaczona: ' +cond[Object.keys(cond)[i]][0]);
						cond[Object.keys(cond)[i]][2] = true;
					},cond[Object.keys(cond)[i]][3]*1000);
				}
			}else{
				console.log('za wczesnie na '+ cond[Object.keys(cond)[i]][0]);
			}
		}

	
}



module.exports = {appendToFile, checkAndCreate, writeJsonData, createNewJsonUsers, checkTrigger};


'use strict';

const SaboteurRegex = require('./SaboteurRegex');

function mainCmd(message, text, db){
  db.register_message(message);
  for (let key in SaboteurRegex.mainRegex) {
    let exp = SaboteurRegex.mainRegex[key];
    if (exp.r.test(text)){
      let matches = exp.f(text, exp.r);
      for (let matched of matches){
	if (exp.p > Math.random()){
	  message.channel.send(matched);
	}
      }
    }
  }
}


function generalPrefixMainCmd(message, text, db){
  console.log("prefix");
}

exports.main = mainCmd;
exports.generalPrefixMain = generalPrefixMainCmd;

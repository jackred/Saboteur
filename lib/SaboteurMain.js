'use strict';

const SaboteurRegex = require('./SaboteurRegex');

function main(){

}

// di
// cri
// clap

function mainCmd(message, text, db, permission){
  console.log('On a écrit un message');
  // for (let exp in SaboteurRegex.main){
    
  // }
}


function generalPrefixMainCmd(message, text, db, permission){
  console.log('On a appelé !');
}

exports.main = mainCmd;
exports.generalPrefixMain = generalPrefixMainCmd;

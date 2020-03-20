'use strict';

const SaboteurController = require('./SaboteurController');
const SaboteurUtility = require('./SaboteurUtility');
//const SaboteurCommand = require('./SaboteurCommand');

function rollADice(value){
  return SaboteurUtility.random2Int(1, value);
}

function parseRoll(diceToRoll){
  let rolled = diceToRoll.split('d');
  return {'nbDices': (rolled[0] == '') ? 1 :  parseInt(rolled[0]), 'vlDice': parseInt(rolled[1])};
}

function roll(rolled) {
  let res = 'You rolled ' + rolled.nbDices + ' dices: ' ;
  let sum = 0;
  for (let j = 0 ; j < rolled.nbDices ; j++){
    let value = rollADice(rolled.vlDice);
    sum += value;
    res += (j == rolled.nbDices - 1) ? (value + '.') : (value + ', ');
  }
  res += ' **Sum: ' + sum + '**';
  return res;
}

function rollCmd(message, text, db){
  let splitted = SaboteurUtility.reduceWhitespace(text);
  for (let dice of splitted){
    let diceSplitted = dice.split('d');
    if (diceSplitted.length !== 2){
      throw this.generalHelp();
      continue;
    }
    let rolled = {
      'nbDices': (diceSplitted[0] == '')
	? 1
	:  parseInt(diceSplitted[0]),
      'vlDice': parseInt(diceSplitted[1])
    };
    if (!(SaboteurUtility.isBetween(rolled.nbDices, 1, 100)
	  && SaboteurUtility.isBetween(rolled.vlDice, 1, 100))){
      throw 'XdY. 1<X<100, 1<Y<100';
      continue;
    }
    message.channel.send(roll(rolled));    
  }  
}

exports.roll = rollCmd;



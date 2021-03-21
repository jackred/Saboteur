'use strict';

const utility = require('./utility');

function roll(msg, args) {
  args = args.replace(/\s+/g, ' ');
  if (!args.startsWith('!')) {
    let argsArray = args.split('!');
    let reason = null;
    if (argsArray.length !== 1) {
      reason = args.substr(argsArray[0].length + 1);
    }
    let tries = 1;
    argsArray = argsArray[0].trim().split(' ');
    if (args.startsWith('*') && argsArray.length === 2) {
      const argsTries = Number(argsArray[0].substr(1));
      if (!isNaN(argsTries) && argsTries > 0) {
        tries = argsTries;
        argsArray = [argsArray[1]];
      }
    }
    if (argsArray.length === 1) {
      argsArray = argsArray[0].split('+');
      let plus;
      if (argsArray.length === 2) {
        const argsPlus = Number(argsArray[1]);
        if (!isNaN(argsPlus)) {
          plus = argsPlus;
          argsArray = [argsArray[0]];
        }
      } else if (argsArray.length === 1) {
        plus = 0;
      } else {
        console.log('cassé');
      }
      let nbRoll = 1;
      let nDice = 20;
      const dice = argsArray[0].split('d');
      try {
        nbRoll = Number(dice[0] || nbRoll);
        nDice = Number(dice[1] || nDice);
      } catch (e) {
        console.log('cassé');
      }
      if (
        nbRoll > 0 &&
        nDice > 0 &&
        nbRoll < 101 &&
        nDice < 101 &&
        nbRoll % 1 === 0 &&
        nDice % 1 === 0
      ) {
        for (let j = 0; j < tries; j++) {
          let res = [];
          for (let i = 0; i < nbRoll; i++) {
            res.push(utility.randomBtwn2(1, nDice));
          }
          const lst = res.join(', ');
          const sum = res.reduce((val, acc) => val + acc);
          let msgDice = `Vous avez lancé ${nbRoll} dé${
            nbRoll > 1 ? 's' : ''
          } ${nDice}. Reason: ${reason}. Somme des lancés: ${sum} + ${plus} = ${
            sum + plus
          }.\nListe des résultats: ${lst}`;
          if (nDice === 20 && nbRoll === 1) {
            if (res[0] === 1) {
              msgDice += '\n**Échec critique!**';
            } else if (res[0] === 20) {
              msgDice += '\n**Succés critique!**';
            }
          }
          console.log(msgDice);
        }
      } else {
        console.log('cassé');
      }
    } else {
      console.log('cassé');
    }
  }
}
roll({}, '4d8');
console.log('-----');
roll({}, '3d50 !dex save');
console.log('-----');
roll({}, '*2 2d17');
console.log('-----');
roll({}, '8d2+400');
console.log('-----');
roll({}, '*2 3d20+15  ! this is one reason ');
console.log('-----');
roll({}, '*2     4d8+400    !dex save');
console.log('-----');
roll({}, '*2 4d8    +400 !dex save');
console.log('-----');
roll({}, '  *   2 4d8+400 !dex     save');

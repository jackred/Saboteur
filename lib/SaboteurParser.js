'use strict';

const config = require('../config.json');
const SaboteurUtility = require('./SaboteurUtility');

function prefixParser(text) {
  let res = -1;
  for (let prefix in config.prefix) { // yeah iterating over all keys when I would have do a while and stop when needed...but I'm lazy this time
    let exp = new RegExp('^'+config.prefix[prefix]);
    if (exp.test(text)){
      let rest = text.replace(exp, '');
      res = {'first': config.prefix[prefix], 'rest': rest.trim()};
    }
  }
  return res;
}


function defaultParser(text, word=' ') {
  let res = SaboteurUtility.splitIn2(text, word);
  return {'first': res[0], 'rest': (res.length === 1) ? '' : res[1].trim() };
}


exports.defaultParser = defaultParser;
exports.prefixParser = prefixParser;

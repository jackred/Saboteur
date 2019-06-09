'use strict';

const config = require('../config.json');

function sayCmd(message, text, db){
  message.delete().catch(o => console.log('j', o))
    .then(() => message.channel.send(text));
}

exports.say = sayCmd;

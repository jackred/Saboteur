const Discord = require('discord.js');
const Tumult = require('tumult');
const config = require('./config.json');
const permission = require('./permission.json');

let cmdPrefix = new Tumult.Command(
  config.prefix.general,
  async (msg, args) => {
    console.log('on use ça', args);
    console.log(`${msg.author.username} used ${config.prefix.general}`);
  },
  {
    subCommand: [], // subCommand
    generalHelp: 'Prefix: ' + config.prefix.general,
    parser: Tumult.Parser.prefixParser, // parser for message
  }
);

const cmd = [cmdPrefix];

let controller = new Tumult.Controller(config.token, permission, {
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  messageCommands: cmd,
});

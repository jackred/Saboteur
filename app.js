const Tumult = require('tumult');
const config = require('./config.json');
const permission = require('./permission.json');

const { subCmdPrefix, subCmdPost } = require('./src/redditCmd');
const { roleInfoCmd, userInfoCmd } = require('./src/findCmd');
const { roleCmd } = require('./src/roleCmd');

let cmdPrefix = new Tumult.Command(
  '!r',
  async (msg, args) => {
    console.log('on use ça', args);
    console.log(`${msg.author.username} used !r`);
    return true;
  },
  {
    subCommand: [subCmdPrefix, subCmdPost], // subCommand
    generalHelp: 'Prefix: !r',
    parser: Tumult.Parser.prefixParser, // parser for message
  }
);

const cmd = [cmdPrefix, roleCmd, roleInfoCmd, userInfoCmd];

let controller = new Tumult.Controller(config.token, permission, {
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  messageCommands: cmd,
});

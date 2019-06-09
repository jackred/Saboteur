const Discord = require('discord.js');
const config = require('./config.json');

// class
const SaboteurDB = require('./lib/SaboteurDB');
const SaboteurController = require('./lib/SaboteurController');
const SaboteurCommand = require('./lib/SaboteurCommand');

// module
const SaboteurDND = require('./lib/SaboteurDND');
const SaboteurParser = require('./lib/SaboteurParser');
const SaboteurMain = require('./lib/SaboteurMain');
const SaboteurAdmin = require('./lib/SaboteurAdmin');

// discord
const client = new Discord.Client();
client.on('ready', () => {
  console.log('Starting!');
  client.user.setActivity(config.activity);
});

// db
let database = new SaboteurDB();

// commands
let cmdRoll = new SaboteurCommand(
  SaboteurDND.roll,
  {},
  0,
  () => '`!roll` allow you to roll different dices. You have to give at least one argument. A roll is composed of 2 things: the number of dice you want to roll and the value of the dice. For example if you want to roll 2 dice 6, the correct argument is `2d6`.\n You can do multiple roll, e.g: `!roll 2d3 4d5 d8`. As you saw, the last argument is only `d8`, because we want to roll only one dice, so the 1 is optional.\nThe limit is 100.'
);

let cmdSay = new SaboteurCommand(
  SaboteurAdmin.say,
  {},
  3,
  '',
  () => '`!say`: whitelist only command. Write a message with the rest of the text and delete the command message sent by the user'
);

let generalPrefixCmd = new SaboteurCommand(
  SaboteurMain.generalPrefixMain,
  {'roll': cmdRoll, 'say': cmdSay},
  0,
  function(){
    return 'General Command prefix: !\n'
      + this.listSubCommand()
      .filter((key) => this.subCommand[key].permission <= config.permission.d).join(', ')
      + '\n';
  },
);
let cmd = new SaboteurCommand(
  SaboteurMain.main,
  {[config.prefix.general]: generalPrefixCmd},
  0,
  '',
  '',
  SaboteurParser.prefixParser
);

// controller
let controller = new SaboteurController(client, cmd, {}, database);



client.login(config.token)
  .then(() => console.log("We're in!"))
  .catch((err) => console.log(err));

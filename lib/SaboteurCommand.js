'use string';

const SaboteurParser = require('./SaboteurParser');

class SaboteurCommand {
  constructor(action, subCommand={},
	      generalHelp='', help='', 
	      parser=SaboteurParser.defaultParser) {
    this.action = action; // function
    this.subCommand = subCommand; // map of Command
    this.help = (help === '') ? this.defaultHelp : help; // function > string
    this.generalHelp = (generalHelp === '') ? this.defaultGeneralHelp : generalHelp; // function > string
    this.parser = parser; // fuction -> [string]
  }

  defaultHelp() {
    console.log('just before', this);
    let msg = this.generalHelp();
    for (let command in this.subCommand) {
      msg += this.subCommand[command].generalHelp();
    }
    return msg;
  }

  defaultGeneralHelp() {
    return '';
  }

  listSubCommand(){
    return Object.keys(this.subCommand);
  }
}

module.exports = SaboteurCommand;




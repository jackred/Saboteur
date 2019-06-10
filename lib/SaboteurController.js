'use strict';

const config = require('../config.json');

class SaboteurController {
  constructor(client, command, reaction, db) {
    this.client = client;
    this.command = command;
    this.reaction = reaction;
    this.db = db;
    this.client.on('message', this.handleMessage.bind(this));
  }

  /*
    w: whitelist
    b: blacklist
    a: admins (roles)
    d: defauly
  */
  getPermission(message){
    if (config.blacklist.find((d) => d === message.author.id)) { return config.permission.b; }
    if (config.whitelist.find((d) => d ===message.author.id)) { return config.permission.w; }
    if (message.member._roles
	.find((r) => config.admins
	      .find((d) => d === r))) {
      return config.permission.a;
    }
    return config.permission.d;
  }
  
  handleReaction(){}

  handleMention(){}

  handleAttachement(){}
  
  handleMessage(message) {
    if (message.author.bot) { return; }
    let permission = this.getPermission(message);
    if (permission === config.permission.b){ return; }
    if (message.channel.type === 'dm'){
      if (permission === config.permission.dm){
	this.handleCommand(this.command, message, message.content, permission);
	return;
      }
    } else if (message.channel.type === 'text') {
      this.handleCommand(this.command, message, message.content, permission);
    }
  }

  handleCommand(command, message, text, permission) {
    console.log(permission, command.permission, permission >= command.permission);
    if (permission >= command.permission){
      let parsed = command.parser(text);
      if (parsed !== -1){
	if (parsed.first === config.help){
	  message.channel.send(command.help.call(command));
	  return;
	}
	if (parsed.first in command.subCommand){
	  this.handleCommand(command.subCommand[parsed.first], message, parsed.rest, permission);
	}
      }
      // register command in db
      command.action.call(command, message, text, this.db); // some ation can trigger command AND args
    }
  }
  static wrong_argument(channel, help){
    channel.send('Wrong argument given. Please, read the help below.\n' + help.call(this));
  } }

module.exports = SaboteurController;

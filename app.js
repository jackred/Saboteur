const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

console.log('Gitlab bots is starting');
client.on('message', respondToMessage);
client.login(config.token);

const clap = "👏";



function respondToMessage(message){
  if (!(message.author.bot)){
    if (message.content.includes(clap) && message.content.replace(new RegExp(clap,"g"), '').replace(/ /g,'') == '') {
      message.channel.send(message.content);
    } else {
      if (message.content == 'tg'){
	message.channel.send('<:lina:559013499649523722>');
      } else if (message.content == 'ping') {
	message.channel.send('pong');
      }
    }
  }
}

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

console.log('Sabteur is starting');
client.on('message', respondToMessage);
client.login(config.token);

const clap = '👏';
const jdrID = '765197945372803073';

async function addRole(member, role) {
  if (member.roles.has(role.id)) {
    return await member
      .removeRole(role)
      .then((_) => `${member.displayName} a perdu le role ${role.name}`);
  } else {
    return await member
      .addRole(role)
      .then((_) => `${member.displayName} a gagné le role ${role.name}`);
  }
}

async function addRoleJDR(member, guild) {
  const role = guild.roles.get(jdrID);
  return await addRole(member, role);
}

function buildEmbedError(error) {
  let embed = new Discord.RichEmbed();
  embed.setTitle(error.name);
  embed.setDescription(error.stack);
  embed.setColor('#FF0000');
  embed.setTimestamp();
  return embed;
}

async function respondToMessage(message) {
  if (!message.author.bot) {
    if (
      message.content.includes(clap) &&
      message.content.replace(new RegExp(clap, 'g'), '').replace(/ /g, '') == ''
    ) {
      message.channel.send(message.content);
    } else {
      switch (message.content) {
        case 'tg': {
          message.channel.send('<:lina:559013499649523722>');
          break;
        }
        case 'ping': {
          message.channel.send('pong');
          break;
        }
        case '!jdr':
          try {
            let msg = await addRoleJDR(message.member, message.guild);
            message.channel.send(msg);
          } catch (e) {
            message.channel.send(buildEmbedError(e));
          }
          break;
      }
    }
  }
}

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

function randomBtwn2(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function roll(message) {
  const msg =
    'Mauvais format pour la commande roll. ex: `!roll XdY` X et Y sont des 0 < nombres < 101';

  const args = message.content.replace('!roll', '').trim();
  const dice = args.split('d');
  if (dice.length === 2) {
    if (!isNaN(dice[0]) && !isNaN(dice[1])) {
      let nbRoll = 1;
      let nDice = 20;
      try {
        nbRoll = Number(dice[0] || nbRoll);
        nDice = Number(dice[1] || nDice);
      } catch (e) {
        message.channel.send(msg);
      }
      if (nbRoll > 0 && nDice > 0 && nbRoll < 101 && nDice < 101) {
        let res = [];
        for (let i = 0; i < nbRoll; i++) {
          res.push(randomBtwn2(1, nDice));
        }
        const lst = res.join(', ');
        const sum = res.reduce((val, acc) => val + acc);
        const msgDice = `Vous avez lancé ${nbRoll} dé${
          nbRoll > 1 ? 's' : ''
        } ${nDice}. Somme des lancés: ${sum}.\nLise des résultats: ${lst}`;
        if (msgDice.length > 1998) {
          message.channel.send('Message trop long ! Trop de lancés !');
        } else {
          message.channel.send(msgDice);
        }
      } else {
        message.channel.send(msg);
      }
    } else {
      message.channel.send(msg);
    }
  } else {
    message.channel.send(msg);
  }
}

async function respondToMessage(message) {
  if (!message.author.bot) {
    if (
      message.content.includes(clap) &&
      message.content.replace(new RegExp(clap, 'g'), '').replace(/ /g, '') == ''
    ) {
      message.channel.send(message.content);
    } else if (message.content.startsWith('!roll')) {
      roll(message);
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

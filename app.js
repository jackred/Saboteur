const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

console.log('Sabteur is starting');
client.on('message', respondToMessage);
client.on('guildMemberAdd', joinMember);
client.login(config.token);

const diReg = /(?=(di(\s*[^\s]*)($|\b)))di/g;
const criReg = /(?=(cri(\s*[^\s]*)($|\b)))cri/g;
const dicriProba = 0.2;
const clap = '👏';
const jdrID = '765197945372803073';
const yuGiOhID = '772480901534711818';
const magicID = '772480789123432448';
const botChanID = '765279134510350387';
const accueilChanID = '496220262887587853';
const annonceChanID = '519089314571878400';
const guildID = '496220262887587850';

function joinMember(member) {
  const chan = member.guild.channels.get(accueilChanID);
  if (chan !== undefined) {
    chan.send(
      `Bienvenue ${member} ! si tu veux participer à un évent, tu peux en apprendre plus dans <#${annonceChanID}>. Tu peux t'ajouter des roles correspondant dans <#${botChanID}>. La commande \`!help\` est également disponible`
    );
  }
}

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

async function addRoleMagic(member, guild) {
  const role = guild.roles.get(magicID);
  return await addRole(member, role);
}

async function addRoleYuGiOh(member, guild) {
  const role = guild.roles.get(yuGiOhID);
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

function buildHelp() {
  let embed = new Discord.RichEmbed();
  embed.setTitle('Aide des commandes');
  embed.setDescription(
    `Les commandes préfixées d'un \`!\` doivent être exécutées dans <#${botChanID}>`
  );
  embed.setColor('#eaff00');
  embed.setTimestamp();
  embed.addField('!jdr', '```Ajoute ou enlève le role JDR```', false);
  embed.addField('!magic', '```Ajoute ou enlève le role Magic```', false);
  embed.addField('!yugioh', '```Ajoute ou enlève le role yu-gi-oh```', false);
  embed.addField('!help', "```Affiche ce message d'aide```", false);
  embed.addField(
    '.roll XdY',
    '```Lance X dé(s) Y et affiche le résultat. Ex: .roll 4d8```',
    false
  );

  return embed;
}

function randomBtwn2(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function roll(message) {
  const msg =
    'Mauvais format pour la commande roll. ex: `.roll XdY` X et Y sont des 0 < nombres < 101';

  const args = message.content.replace('.roll', '').trim();
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
      if (
        nbRoll > 0 &&
        nDice > 0 &&
        nbRoll < 101 &&
        nDice < 101 &&
        nbRoll % 1 === 0 &&
        nDice % 1 === 0
      ) {
        let res = [];
        for (let i = 0; i < nbRoll; i++) {
          res.push(randomBtwn2(1, nDice));
        }
        const lst = res.join(', ');
        const sum = res.reduce((val, acc) => val + acc);
        let msgDice = `Vous avez lancé ${nbRoll} dé${
          nbRoll > 1 ? 's' : ''
        } ${nDice}. Somme des lancés: ${sum}.\nListe des résultats: ${lst}`;
        if (nDice === 20 && nbRoll === 1) {
          if (res[0] === 1) {
            msgDice += '\n**Échec critique!**';
          } else if (res[0] === 20) {
            msgDice += '\n**Succés critique!**';
          }
        }
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

function matchRec(text, exp, transform) {
  let tmp = [];
  let match;
  while ((match = exp.exec(text)) != null) {
    tmp.push(transform(match[2]));
  }
  return tmp;
}

function transformDi(str) {
  return str.trim();
}

function transformCri(str) {
  return transformDi(str).toUpperCase();
}

function writeDiorCri(message) {
  let diArray = matchRec(message.content, diReg, transformDi);
  let criArray = matchRec(message.content, criReg, transformCri);
  let toSend = [...diArray, ...criArray].filter(
    (d) => Math.random() <= dicriProba
  );
  let idx = Math.ceil(Math.random() * toSend.length) - 1;
  if (idx !== -1) {
    message.channel.send(toSend[idx]);
  }
}

async function doCommandInBotChan(message, fn, cmd, ...arg) {
  if (message.channel.type === 'text') {
    if (message.channel.id === botChanID) {
      try {
        let msg = await fn(...arg);
        message.channel.send(msg);
      } catch (e) {
        message.channel.send(buildEmbedError(e));
      }
    } else {
      const chan = message.guild.channels.get(botChanID);
      if (chan !== undefined) {
        await chan.send(
          `${message.member} il faut utiliser ce channel pour les commandes comme \`${cmd}\` pour ne pas spam.`
        );
        await message.delete();
      }
    }
  }
}

async function respondToMessage(message) {
  if (!message.author.bot) {
    writeDiorCri(message);
    if (
      message.content.includes(clap) &&
      message.content.replace(new RegExp(clap, 'g'), '').replace(/ /g, '') == ''
    ) {
      message.channel.send(message.content);
    } else if (message.content.startsWith('.roll')) {
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
        case '!jdr': {
          await doCommandInBotChan(
            message,
            addRoleJDR,
            '!jdr',
            message.member,
            message.guild
          );
          break;
        }
        case '!magic': {
          await doCommandInBotChan(
            message,
            addRoleMagic,
            '!magic',
            message.member,
            message.guild
          );
          break;
        }
        case '!yugioh': {
          await doCommandInBotChan(
            message,
            addRoleYuGiOh,
            '!yugioh',
            message.member,
            message.guild
          );
          break;
        }
        case '!help': {
          await doCommandInBotChan(message, buildHelp, '!help');
          break;
        }
      }
    }
  }
}

'use strict';

const Discord = require('discord.js');
const axios = require('axios');

const rURL = 'https://reddit.com';

function buildCode(text, format = '') {
  return '```' + format + '\n' + text + '\n' + '```';
}

function buildEmbedReddit() {
  let embed = new Discord.MessageEmbed();
  embed.setColor('#FF0000');
  embed.setFooter(
    'reddit',
    'https://cdn.discordapp.com/attachments/511091132302622720/809895537829478410/iu.png'
  );
  return embed;
}

function buildEmbedSubReddit(sub) {
  let embed = buildEmbedReddit();
  if (sub.banner_img !== '') {
    embed.setImage(sub.banner_img);
  } else if (sub.banner_background_image !== '') {
    embed.setImage(sub.banner_background_image.split('?width=')[0]);
  }
  embed.setAuthor(sub.url, sub.icon_img, rURL + '/' + sub.url);
  embed.setTitle(sub.title);
  embed.setDescription(`*${sub.public_description}*`);
  const subscriber = `subscribers: ${sub.subscribers}
activesq:     ${sub.accounts_active}`;
  embed.addField('Members', buildCode(subscriber, 'yaml'));
  embed.footer.text += ' | sub creation date';
  embed.setTimestamp(sub.created_utc * 1000);
  return embed;
}

async function requestSubAndBuildEmbed(subName) {
  const sub = await axios.get(`https://reddit.com/r/${subName}/about.json`);
  if (sub.data.data.over18) {
    return 'sub is nsfw!';
  } else {
    return buildEmbedSubReddit(sub.data.data);
  }
}

module.exports = { requestSubAndBuildEmbed };

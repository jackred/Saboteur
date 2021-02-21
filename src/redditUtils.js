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

function buildAwardPostReddit(post, client) {
  return {
    name: `Award${post.total_awards_received > 1 ? 's' : ''}: ${
      post.total_awards_received
    }`,
    value: post.all_awardings
      .map((d) => {
        const emj = client.emojis.cache.find(
          (e) => e.name === d.name.replace(/\s/g, '')
        );
        return (emj === undefined ? d.name : emj.toString()) + ' ' + d.count;
      })
      .join(' '),
  };
}

function buildEmbedPostReddit(post, sub, client) {
  let extend = '';
  let embed = buildEmbedReddit();
  embed.setAuthor(
    `${sub.url} by u/${post.author}`,
    sub.icon_img,
    rURL + '/' + sub.url
  );
  embed.setTitle(post.title);
  embed.setURL(rURL + '/' + post.permalink);
  embed.setTimestamp(post.created_utc * 1000);
  embed.footer.text += ' | post creation date';
  if (post.link_flair_text !== null) {
    embed.setDescription(`**[${post.link_flair_text}]**`);
  }
  if (post.selftext !== '') {
    let text = post.selftext;
    if (post.selftext.length > 500) {
      text = text.substr(0, 500) + '...';
      extend = post.selftext;
    }
    embed.addField('-', text);
  }
  const infos = `Comment${post.num_comments > 1 ? 's' : ''}: ${
    post.num_comments
  }
Karma: ${post.score}
Ratio: ${post.upvote_ratio}`;
  embed.addField('Infos', buildCode(infos, 'yaml'));
  if (post.total_awards_received > 0) {
    embed.addFields(buildAwardPostReddit(post, client));
  }
  if ('url_overridden_by_dest' in post) {
    embed.setImage(post['url_overridden_by_dest']);
  }
  return { embed, extend };
}

async function requestSubAndBuildEmbed(subName) {
  const sub = await axios.get(`https://reddit.com/r/${subName}/about.json`);
  if (sub.data.data.over18) {
    return 'sub is nsfw!';
  } else {
    return buildEmbedSubReddit(sub.data.data);
  }
}

async function requestPostAndBuildEmbed(subName, client) {
  const posts = await axios.get(`https://reddit.com/r/${subName}/top.json`);
  let post = posts.data.data.children[0].data;
  const sub = await axios.get(`https://reddit.com/r/${subName}/about.json`);
  if (post.over_18) {
    return 'sub is nsfw!';
  } else {
    return buildEmbedPostReddit(post, sub.data.data, client);
  }
}

module.exports = { requestSubAndBuildEmbed, requestPostAndBuildEmbed };

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
  const subscriber = `subscriber${sub.subscribers > 1 ? 's' : ''}: ${
    sub.subscribers
  }
active${sub.accounts_active > 1 ? 's' : ''}:     ${sub.accounts_active}`;
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

function buildEmbedListPostReddit(posts, sub) {
  let embed = buildEmbedReddit();
  embed.setTitle(`Top post in ${sub.title}`);
  embed.setAuthor(sub.url, sub.icon_img, rURL + '/' + sub.url);
  embed.setDescription(`*${sub.public_description}*`);
  for (let i = 0; i < Math.min(posts.length, 10); i++) {
    let post = posts[i].data;
    let field = `[link](${rURL + '/' + post.permalink})`;
    if (post.link_flair_text !== null) {
      field += ` | **[${post.link_flair_text}]**`;
    }
    field += '\n';
    if (post.selftext !== '') {
      let text = post.selftext;
      if (post.selftext.length > 150) {
        text = text.substr(0, 150) + '...';
      }
      field += text + '\n';
    }
    const infos = `Comment${post.num_comments > 1 ? 's' : ''}: ${
      post.num_comments
    } | Karma: ${post.score} | Ratio: ${post.upvote_ratio}`;
    field += buildCode(infos, 'yaml');
    embed.addField(post.title, field);
  }
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

// todo: check nsfw before request post
async function requestPostAndBuildEmbed(subName, client) {
  const posts = await axios.get(`https://reddit.com/r/${subName}/top.json`);
  let post = posts.data.data.children[0].data;
  const sub = await axios.get(`https://reddit.com/r/${subName}/about.json`);
  if (post.over_18) {
    return 'sub or post is nsfw!';
  } else {
    return buildEmbedPostReddit(post, sub.data.data, client);
  }
}

async function requestListOfPostsAndBuildEmbed(subName) {
  const posts = await axios.get(`https://reddit.com/r/${subName}/top.json`);
  const sub = await axios.get(`https://reddit.com/r/${subName}/about.json`);
  if (sub.data.data.over_18) {
    return 'sub is nsfw!';
  } else {
    return buildEmbedListPostReddit(posts.data.data.children, sub.data.data);
  }
}

module.exports = {
  requestSubAndBuildEmbed,
  requestPostAndBuildEmbed,
  requestListOfPostsAndBuildEmbed,
};

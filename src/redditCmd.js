'use strict';

const Tumult = require('tumult');
const redditUtils = require('./redditUtility');
const { redditParser } = require('./parser');

let subCmdList = new Tumult.Command(
  'list',
  async (msg, args) => {
    console.log('list');
    await msg.channel.send(
      await redditUtils.requestListOfPostsAndBuildEmbed(args)
    );
    return true;
  },
  {
    generalHelp: 'subreddit list function',
    parser: redditParser,
  }
);

const emoji_extend = '➕';
function filter_extend(reaction, user, author) {
  return (
    !user.bot && reaction.emoji.name === emoji_extend && author.id === user.id
  );
}

let subCmdPost = new Tumult.Command(
  'info',
  async (msg, args) => {
    let res = await redditUtils.requestPostAndBuildEmbed(args, msg.client);
    let new_msg = await msg.channel.send(res.embed);
    if (res.extend !== '') {
      await new_msg.react(emoji_extend);
      let collector = new_msg.createReactionCollector(
        (r, u) => filter_extend(r, u, msg.author),
        {
          max: 1,
        }
      );
      collector.on('collect', (r) =>
        r.message.edit(
          r.message.embeds[0].spliceFields(0, 1, {
            name: r.message.embeds[0].fields[0].name,
            value: res.extend.substr(0, 1000),
          })
        )
      );
      collector.on('end', (c) => c.first().message.reactions.removeAll());
    }
    return true;
  },
  {
    generalHelp: 'subreddit post function',
    parser: redditParser,
  }
);

let subCmdPrefix = new Tumult.Command(
  '/',
  async (msg, args) => {
    await msg.channel.send(await redditUtils.requestSubAndBuildEmbed(args));
    return true;
  },
  {
    subCommand: [subCmdList, subCmdPost],
    generalHelp: 'subreddit subfunction',
    parser: Tumult.Parser.prefixParser,
  }
);

module.exports = { subCmdPrefix };

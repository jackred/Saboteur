'use strict';

const Tumult = require('tumult');
const redditUtils = require('./src/redditUtils');

let subCmdPrefix = new Tumult.Command(
  '/',
  async (msg, args) => {
    await msg.channel.send(await redditUtils.requestSubAndBuildEmbed(args));
    return true;
  },
  {
    generalHelp: 'subreddit subfunction',
    parser: Tumult.Parser.prefixParser,
  }
);

module.exports = { subCmdPrefix };

'use strict';

const Tumult = require('tumult');
const { findRole, findMember } = require('./findUtility');
const { buildEmbedRole, buildEmbedMember } = require('./buildUtility');

let roleInfoCmd = new Tumult.Command(
  ['roleinfo', 'ri'],
  async (msg, args) => {
    const role = findRole(args, msg.guild, msg.mentions.roles);
    if (role.found) {
      msg.channel.send(buildEmbedRole(role.value));
    } else {
      msg.channel.send(role.msg);
    }
    return true;
  },
  {
    generalHelp: 'role info',
  }
);

let userInfoCmd = new Tumult.Command(
  ['userinfo', 'whois', 'ui'],
  async (msg, args) => {
    const member = findMember(args, msg.guild, msg.mentions.users);
    if (member.found) {
      msg.channel.send(buildEmbedMember(member.value));
    } else {
      msg.channel.send(member.msg);
    }
    return true;
  },
  {
    generalHelp: 'user info',
  }
);

module.exports = { userInfoCmd, roleInfoCmd };

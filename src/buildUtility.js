'use strict';

const Discord = require('discord.js');
const { cutAt } = require('./utility');

function buildEmbedRole(role) {
  let embed = new Discord.MessageEmbed();
  embed.setTitle(role.name);
  embed.setColor(role.color);
  embed.setFooter(`ID: ${role.id}`);
  embed.setTimestamp();
  embed.setDescription(role);

  embed.addField('Mentionable', role.mentionable, true);
  embed.addField('Managed', role.managed, true);
  embed.addField('Hoist', role.hoist, true);
  embed.addField('Position', role.rawPosition, true);
  embed.addField('Creation Date', role.createdAt.toDateString(), true);
  embed.addField('Members Count', role.members.size, true);
  let perms = role.guild.roles.everyone.permissions.missing(role.permissions);
  if (perms.length > 0) {
    embed.addField('Permissions', perms.join(', '));
  }
  return embed;
}

function getStatusPresence(status) {
  const liste = {
    online: '🟢 online',
    dnd: '🔴 dnd',
    offline: '⚫ offline',
    idle: '🟡 idle',
  };
  return liste[status];
}

function buildEmbedMember(member) {
  let embed = new Discord.MessageEmbed();
  embed.setAuthor(member.user.tag, member.user.avatarURL());
  embed.setColor(member.displayColor);
  embed.setFooter(`ID: ${member.id}`);
  embed.setTimestamp();
  embed.setDescription(member);
  embed.setThumbnail(member.user.avatarURL());
  embed.addField('Join Date', member.joinedAt.toDateString(), true);
  embed.addField('Register Date', member.user.createdAt.toDateString(), true);
  if (member.user.bot) {
    embed.addField('Bot', true, true);
  }
  if (member.premiumSince !== null) {
    embed.addField('Premium Date', member.premiumSince, true);
  }
  embed.addField(
    'Joined Position',
    member.guild.members.cache
      .sort(
        (memberA, memberB) => memberA.joinedTimestamp - memberB.joinedTimestamp
      )
      .keyArray()
      .indexOf(member.id),
    true
  );
  embed.addField('Presence', getStatusPresence(member.presence.status), true);
  let perms = member.guild.roles.everyone.permissions.missing(
    member.permissions
  );
  if (perms.length > 0) {
    embed.addField('Permissions', perms.join(', '));
  }
  let roles = member.roles.cache.array().join(' ').replace('@everyone', '');
  roles = cutAt(roles, 1000, '<');
  if (roles.length > 0) {
    embed.addField('Roles', roles);
  }
  return embed;
}

module.exports = { buildEmbedMember, buildEmbedRole };

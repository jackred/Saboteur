'use strict';
const { cutAt } = require('./utility');
const { findRole } = require('./findUtility');

async function sendInfoRole(roles, string, channel) {
  if (roles.length > 0) {
    let s = '';
    if (roles.length > 1) {
      s = 's';
    }
    await channel.send(
      `${string}${s} : ${cutAt(
        roles.map((r) => `\`${r.name}\``).join(', '),
        500,
        ','
      )}`
    );
  }
}

function buildRolesArray(args, guild, mentions, separator = ';') {
  const argsArray = args.split(separator);
  let tmpRole;
  let roles = [];
  let i = 0;
  while (
    i < argsArray.length && // args[roles.length]
    (tmpRole = findRole(argsArray[i], guild, mentions.roles)).found
  ) {
    roles.push(tmpRole.value);
    i++;
  }
  if (roles.length === argsArray.length) {
    const rolesSet = new Set(roles);
    if (rolesSet.has(guild.roles.everyone)) {
      rolesSet.delete(guild.roles.everyone);
    }
    return { found: true, value: rolesSet };
  } else {
    return tmpRole;
  }
}

function divideRoleByPermission(roles, highest) {
  let rolesToUse = [];
  let rolesTooHigh = [];
  for (let role of roles.values()) {
    if (role.position < highest.position) {
      rolesToUse.push(role);
    } else {
      rolesTooHigh.push(role);
    }
  }
  return { rolesToUse, rolesTooHigh };
}

async function executeRoleFunction(msg, args, fn) {
  const resRoles = buildRolesArray(args, msg.guild, msg.mentions, ';');
  if (resRoles.found) {
    const roles = divideRoleByPermission(
      resRoles.value,
      msg.guild.me.roles.highest
    );
    await sendInfoRole(
      roles.rolesTooHigh,
      "I can't manage the following role",
      msg.channel
    );
    await fn(msg, roles.rolesToUse);
  } else {
    await msg.channel.send(resRoles.msg);
    console.log(resRoles.msg);
  }
}

async function addRoles(msg, roles) {
  await msg.member.roles.add(roles);
  await sendInfoRole(
    roles,
    `${msg.member.displayName} has now the role`,
    msg.channel
  );
}

async function addRolesAction(msg, args) {
  await executeRoleFunction(msg, args, addRoles);
  return true;
}

async function rmRoles(msg, roles) {
  await msg.member.roles.remove(roles);
  await sendInfoRole(
    roles,
    `${msg.member.displayName} has lost the role`,
    msg.channel
  );
}

async function rmRolesAction(msg, args) {
  await executeRoleFunction(msg, args, rmRoles);
  return true;
}

async function toggleRoles(msg, roles) {
  let rolesToRemove = [];
  let rolesToAdd = [];
  for (let role of roles) {
    if (msg.member.roles.cache.has(role.id)) {
      await rolesToRemove.push(role);
    } else {
      await rolesToAdd.push(role);
    }
  }
  console.log('i', rolesToRemove, 'jj', rolesToAdd);
  await rmRoles(msg, rolesToRemove);
  await addRoles(msg, rolesToAdd);
}

async function toggleRolesAction(msg, args) {
  await executeRoleFunction(msg, args, toggleRoles);
  return true;
}

module.exports = { addRolesAction, rmRolesAction, toggleRolesAction };
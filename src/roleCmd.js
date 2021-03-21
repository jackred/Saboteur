'use strict';
const Tumult = require('tumult');
const {
  addRolesAction,
  rmRolesAction,
  toggleRolesAction,
  addRolesAdminAction,
  rmRolesAdminAction,
  toggleRolesAdminAction,
} = require('./roleUtility');

//////
// add command
//////
let roleCmdAddAdmin = new Tumult.Command(['-a'], addRolesAdminAction, {
  generalHelp: 'role add function admin',
});

let roleCmdAdd = new Tumult.Command(['add', 'a'], addRolesAction, {
  subCommand: [roleCmdAddAdmin],
  generalHelp: 'role add function',
});

//////
// rm command
//////
let roleCmdRmAdmin = new Tumult.Command(['-a'], rmRolesAdminAction, {
  generalHelp: 'role rm function admins',
});

let roleCmdRm = new Tumult.Command(['rm', 'r'], rmRolesAction, {
  subCommand: [roleCmdRmAdmin],
  generalHelp: 'role rm function',
});

//////
// toggle command
//////
let roleCmdToggleAdmin = new Tumult.Command(['-a'], toggleRolesAdminAction, {
  generalHelp: 'role toggle function admins',
});

let roleCmdToggle = new Tumult.Command(['toggle', 't'], toggleRolesAction, {
  subCommand: [roleCmdToggleAdmin],
  generalHelp: 'role toggle function',
});

//////
// role command
//////
let roleCmd = new Tumult.Command(
  ['role', 'i'],
  async (msg, args) => {
    console.log('role called');
    return true;
  },
  {
    subCommand: [roleCmdAdd, roleCmdRm, roleCmdToggle],
    generalHelp: 'role subfunction',
  }
);

module.exports = { roleCmd };

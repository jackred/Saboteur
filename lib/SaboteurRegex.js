'use strict';


const mainRegex = {
  "clapR": new RegExp('^(\s*👏)(👏|\s)*$'),
  "di" : new RegExp('di', 'i'),
  "cri": new RegExp('cri', 'i') 
};

exports.mainRegex = mainRegex;

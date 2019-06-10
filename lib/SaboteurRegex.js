'use strict';

function matchRec(text, exp, transform){
  let tmp = [];
  let match;
  while ((match = exp.exec(text)) != null){
    tmp.push(transform(match[2]));
  } 
  return tmp;
}

function transformDi(str){
  return str.trim();
}

function transformCri(str){
  return transformDi(str).toUpperCase();
}



const mainRegex = {
  "clapR": {
    'r': /^(\s*👏)(👏|\s)*$/g,
    'p': 1,
    'f': (text, exp) => text.match(exp)
  },
  "di" :  {
    'r':/(?=(di(\s*[^\s]*|[^\s]*)($|\b)))di/g,
    'p': 0.2,
    'f': (text, exp) => matchRec(text, exp, transformDi)
  },
  "cri": {
    'r': /(?=(cri(\s*[^\s]*|[^\s]*)($|\b)))cri/g,
    'p': 0.2,
    'f': (text, exp) => matchRec(text, exp, transformCri)
  }
};

exports.mainRegex = mainRegex;

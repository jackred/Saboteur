'use strict';

function cutAt(string, nbMax, limitChar = '') {
  if (string.length > nbMax) {
    string = string.slice(0, nbMax);
    if (limitChar !== '') {
      string = string.slice(0, string.lastIndexOf(limitChar));
    }
    string += '...';
  }
  return string;
}

function randomBtwn2(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = { cutAt, randomBtwn2 };

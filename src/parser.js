/* text should be of form
   "sub [command]"
   the options are:
   - "sub X", X being an integer
   - "sub list"
   - "sub some words for search"
   - "sub --option"
   - "sub X --option"

   so basically, should isolate the first word after sub
*/
function redditParser(text, word, separatorWord = ' ') {
  const split = text.split(separatorWord);
  if (split.length > 1 && split[1] === word) {
    const rest = text.replace(separatorWord + word, '');
    return { arg: rest.trim(), commandCalled: true };
  } else {
    return { commandCalled: false };
  }
}

module.exports = { redditParser };

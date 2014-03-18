var fs;

fs = require('fs');

module.exports = function(item) {
  if (!fs.existsSync(item)) {
    return;
  }
  return fs.readFileSync(item, 'utf8');
};

var fs;

fs = require('fs');


/**
 * Read file.
 *
 * @return {String} the file content
 */

module.exports = function(item) {
  if (!fs.existsSync(item)) {
    return;
  }
  return fs.readFileSync(item, 'utf8');
};

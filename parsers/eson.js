
/**
 * Eson.
 *
 * Cannot be used directly; muse instantiate.
 *
 * @see https://github.com/visionmedia/eson
 *
 * @return {Function} the Eson class.
 */
var eson;

module.exports = eson = require('eson');


/**
 * Similar to `eson.ms` but convert to seconds.
 */

eson.seconds = function(key, val) {
  var m, n, type;
  m = /^(\d+) *(seconds?|s|minutes?|m|hours?|h|days?|d)$/.exec(val);
  if (!m) {
    return;
  }
  n = ~~m[1];
  type = m[2];
  switch (type) {
    case 'days':
    case 'day':
    case 'd':
      return n * 86400;
    case 'hours':
    case 'hour':
    case 'h':
      return n * 3600;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * 60;
    case 'seconds':
    case 'second':
    case 's':
      return n;
  }
};

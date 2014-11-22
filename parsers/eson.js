
/**
 * Eson.
 *
 * Cannot be used directly; muse instantiate.
 *
 * @see https://github.com/visionmedia/eson
 *
 * @return {Function} the Eson class.
 */
var eson, moment;

module.exports = eson = require('eson');

moment = require('moment');


/**
 * Similar to `eson.ms` but convert to a Moment duration.
 *
 * @see http://momentjs.com/docs/#/durations/
 */

eson.duration = function(key, val) {
  var m, n, type;
  m = /^(\d+) *(milliseconds?|seconds?|minutes?|hours?|days?|weeks?|months?|years?)$/.exec(val);
  if (!m) {
    return;
  }
  n = ~~m[1];
  type = m[2];
  return moment.duration(n, type);
};


/**
 * Similar to `eson.ms` but built with duration.
 *
 * The API is slightly different with `eson.ms`. See `eson.duration()`.
 */

eson.milliseconds = function(key, val) {
  var duration;
  duration = eson.duration.apply(eson, arguments);
  if (duration) {
    return duration.asMilliseconds();
  } else {
    return null;
  }
};


/**
 * Similar to `eson.ms` but convert to seconds.
 *
 * Now built with duration.
 */

eson.seconds = function(key, val) {
  var duration;
  duration = eson.duration.apply(eson, arguments);
  if (duration) {
    return duration.asSeconds();
  } else {
    return null;
  }
};

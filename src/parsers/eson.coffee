###*
 * Eson.
 *
 * Cannot be used directly; muse instantiate.
 *
 * @see https://github.com/visionmedia/eson
 *
 * @return {Function} the Eson class.
###
module.exports = eson = require('eson')

moment = require('moment')

###*
 * Similar to `eson.ms` but convert to a Moment duration.
 *
 * @see http://momentjs.com/docs/#/durations/
###
eson.duration = (key, val) ->
    m = /^(\d+) *(milliseconds?|seconds?|minutes?|hours?|days?|weeks?|months?|years?)$/.exec(val)
    return if not m
    n = ~~m[1]
    type = m[2]
    return moment.duration(n, type)

###*
 * Similar to `eson.ms` but built with duration.
 *
 * The API is slightly different with `eson.ms`. See `eson.duration()`.
###
eson.milliseconds = (key, val) ->
    duration = eson.duration(arguments...)
    return if duration then duration.asMilliseconds() else null

###*
 * Similar to `eson.ms` but convert to seconds.
 *
 * Now built with duration.
###
eson.seconds = (key, val) ->
    duration = eson.duration(arguments...)
    return if duration then duration.asSeconds() else null

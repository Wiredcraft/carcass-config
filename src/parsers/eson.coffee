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

###*
 * Similar to `eson.ms` but convert to seconds.
###
eson.seconds = (key, val) ->
    m = /^(\d+) *(seconds?|s|minutes?|m|hours?|h|days?|d)$/.exec(val)
    return if not m
    n = ~~m[1]
    type = m[2]
    switch type
        when 'days', 'day', 'd'
            return n * 86400
        when 'hours', 'hour', 'h'
            return n * 3600
        when 'minutes', 'minute', 'm'
            return n * 60
        when 'seconds', 'second', 's'
            return n

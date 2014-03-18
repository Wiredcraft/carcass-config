# debug = require('debug')('carcass:config')

carcass = require('carcass')

###*
 * Represents a config.
 *
 * A simple implement of proto/config.
 *
 * @param *source
###
module.exports = class Config
    constructor: -> @initialize(arguments...)

carcass.mixable(Config)
Config::mixin(require('../proto/config'))

###*
 * Initializer.
###
Config::initialize = ->
    # Default parser to a simple require.
    @parser(require)
    # Use arguments as sources.
    @source(source) for source in arguments
    return @

###*
 * Simply route to _load().
###
Config::reload = -> return @_load(arguments...)

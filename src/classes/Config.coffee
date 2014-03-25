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
    ###*
     * Constructor.
    ###
    constructor: ->
        # Default parser to a simple require.
        @parser(require)
        # Use arguments as sources.
        @source(source) for source in arguments

    ###*
     * Simply route to _load().
    ###
    reload: -> return @_load(arguments...)

###*
 * Mixins.
###
carcass.mixable(Config)
Config::mixin(require('../proto/config'))

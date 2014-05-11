path = require('path')
carcass = require('carcass')
configurable = require('configurable')
configProto = require('./config')
parsers = require('../').parsers
_ = require('lodash')

###*
 * Mixin this so your object / instance becomes a config manager. It will have
 *   the ability to load a stack of config files, parse them with a set of
 *   parsers, and store the result in the object / instance.
 *
 * @see `npm info configurable`
###
module.exports = _.merge(configProto, {
    ###*
     * ENV is used in a config file name.
     *
     * @type {Function}
    ###
    env: carcass.helpers.accessor('_env', ->
        return process.env.NODE_ENV ? 'development'
    )

    ###*
     * We assume all the config files are in a same directory.
     *
     * @type {Function}
    ###
    configDir: carcass.helpers.accessor('_configDir')

    ###*
     * Initialize config.
    ###
    initConfig: (filename = 'config.json') ->
        configurable(@)
        # Default parsers.
        @parser([parsers.file, parsers.cjson, parsers.eson()])
        # Stack config file, plus some variations.
        dir = @configDir()
        return @ if not dir?
        ext = path.extname(filename)
        name = path.basename(filename, ext)
        # Default.
        @source(path.resolve(dir, name + '.default' + ext))
        # Environment.
        @source(path.resolve(dir, name + '.' + @env() + ext))
        # The file.
        @source(path.resolve(dir, filename))
        return @

    ###*
     * In addition to loading the configs, it also extends settings.
    ###
    reload: (done = ->) ->
        @_load((err, res) =>
            return done(err) if err
            @settings = _.merge(@settings ? {}, res)
            done(err, res)
        )

    ###*
     * Helper; get an instance of a class and set some defaults.
    ###
    getConsumer: (name, args...) ->
        if _.isFunction(name)
            # A provided class.
            ins = new name(args...)
            ins.configManager?(@)
        else if @classes? and _.isFunction(@classes[name])
            # Otherwise an internal class.
            ins = new @classes[name](args...)
            ins.configManager?(@)
        # TODO: otherwise throw.
        return ins
})

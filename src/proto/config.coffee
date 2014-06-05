# debug = require('debug')('carcass:config')

carcass = require('carcass')
highland = carcass.highland
_ = require('lodash')

###*
 * Mixin this so your object / instance can become a config loader, which can
 *   have a stack of sources, a parser, and can load the sources with the
 *   parser and merge (a deep merge) the results together.
 *
 * @type {Object}
###
module.exports = {
    ###*
     * A stack of sources.
     *
     * @type {Function}
    ###
    source: carcass.helpers.stacker('_sources')

    ###*
     * One parser, or an array of parsers.
     *
     * @type {Function}
    ###
    parser: carcass.helpers.accessor('_parser')

    ###*
     * Builder; returns a function which can be used to map a stream with a
     *   given parser.
     *
     * @param {Function|Object} parser can be either a function or an object, in
     *   which case the parser.parse() will be used.
     *
     * @return {Function} curried map().
     *
     * @private
    ###
    _mapWith: (parser) ->
        return highland.map((item) ->
            return parser(item) if _.isFunction(parser)
            return parser.parse(item) if _.isObject(parser) and parser.parse?
            return item
        )

    ###*
     * Loads all the sources and parses with a given parser, and merges the
     *   results together.
     *
     * Bad results (false, null, undefined) are skipped.
     *
     * @param {Function|null} done the callback, if provided, will be called
     *   with the result, and if not provided, the stream will be returned.
     *
     * @return {this|stream} depends on whether a callback is provided.
     *
     * @private
    ###
    _load: (done) ->
        parser = @parser()
        stream = highland(@source())
        # Either a single parser or an array of parsers.
        if _.isArray(parser)
            stream = @_mapWith(p)(stream).flatten().compact() for p in parser
        else
            stream = @_mapWith(parser)(stream).flatten().compact()
        # Deeply merge all the results.
        stream = stream.reduce({}, _.merge)
        # TODO: stream.errors()
        return stream if not done?
        stream.pull(done)
        return @
}

var carcass, extend, isArray, isFunction, isObject, _;

isArray = require('util').isArray;

carcass = require('carcass');

_ = carcass.highland;

extend = carcass.Object.extendDeep;

isObject = carcass.Object.isObject;

isFunction = carcass.Function.isFunction;


/**
 * Mixin this so your object / instance can become a config loader, which can
 *   have a stack of sources, a parser, and can load the sources with the
 *   parser and merge (a deep merge) the results together.
 *
 * @type {Object}
 */

module.exports = {

  /**
   * A stack of sources.
   *
   * @type {Function}
   */
  source: carcass.helpers.stacker('_sources'),

  /**
   * One parser, or an array of parsers.
   *
   * @type {Function}
   */
  parser: carcass.helpers.accessor('_parser'),

  /**
   * Builder; returns a function which can be used to map a stream with a
   *   given parser.
   *
   * @param {Function|Object} parser can be either a function or an object, in
   *   which case the parser.parse() will be used.
   *
   * @return {Function} curried flatMap().
   *
   * @private
   */
  _mapWith: function(parser) {
    return _.flatMap(function(item) {
      if (isFunction(parser)) {
        return parser(item);
      }
      if (isObject(parser) && (parser.parse != null)) {
        return parser.parse(item);
      }
      return item;
    });
  },

  /**
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
   */
  _load: function(done) {
    var p, parser, stream, _i, _len;
    parser = this.parser();
    stream = _(this.source());
    if (isArray(parser)) {
      for (_i = 0, _len = parser.length; _i < _len; _i++) {
        p = parser[_i];
        stream = this._mapWith(p)(stream).compact();
      }
    } else {
      stream = this._mapWith(parser)(stream).compact();
    }
    stream = stream.reduce({}, extend);
    if (done == null) {
      return stream;
    }
    stream.pull(done);
    return this;
  }
};

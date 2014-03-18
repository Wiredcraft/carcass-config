var carcass, configProto, configurable, extend, isFunction, parsers, path;

path = require('path');

carcass = require('carcass');

configurable = require('configurable');

configProto = require('./config');

parsers = require('../').parsers;

extend = carcass.Object.extendDeep;

isFunction = carcass.Function.isFunction;


/**
 * Mixin this so your object / instance becomes a config manager. It will have
 *   the ability to load a stack of config files, parse them with a set of
 *   parsers, and store the result in the object / instance.
 *
 * @see `npm info configurable`
 */

module.exports = extend(configProto, {

  /**
   * ENV is used in a config file name.
   *
   * @type {Function}
   */
  env: carcass.helpers.accessor('_env', {
    getDefault: function() {
      var _ref;
      return (_ref = process.env.NODE_ENV) != null ? _ref : 'development';
    }
  }),

  /**
   * We assume all the config files are in a same directory.
   *
   * @type {Function}
   */
  configDir: carcass.helpers.accessor('_configDir'),

  /**
   * Initialize config.
   */
  initConfig: function(filename) {
    var dir, ext, name;
    if (filename == null) {
      filename = 'config.json';
    }
    configurable(this);
    this.parser([parsers.file, parsers.cjson, parsers.eson()]);
    dir = this.configDir();
    if (dir == null) {
      return this;
    }
    ext = path.extname(filename);
    name = path.basename(filename, ext);
    this.source(path.resolve(dir, name + '.default' + ext));
    this.source(path.resolve(dir, name + '.' + this.env() + ext));
    this.source(path.resolve(dir, filename));
    return this;
  },

  /**
   * In addition to loading the configs, it also extends settings.
   */
  reload: function(done) {
    if (done == null) {
      done = function() {};
    }
    return this._load((function(_this) {
      return function(err, res) {
        var _ref;
        if (err) {
          return done(err);
        }
        _this.settings = extend((_ref = _this.settings) != null ? _ref : {}, res);
        return done(err, res);
      };
    })(this));
  },

  /**
   * Helper; get an instance of a class and set some defaults.
   */
  getConsumer: function(name, options) {
    var ins;
    if (isFunction(name)) {
      ins = new name(options);
      if (typeof ins.configManager === "function") {
        ins.configManager(this);
      }
    } else if ((this.classes != null) && isFunction(this.classes[name])) {
      ins = new this.classes[name](options);
      if (typeof ins.configManager === "function") {
        ins.configManager(this);
      }
    }
    return ins;
  }
});

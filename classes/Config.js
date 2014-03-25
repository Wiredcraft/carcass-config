var Config, carcass;

carcass = require('carcass');


/**
 * Represents a config.
 *
 * A simple implement of proto/config.
 *
 * @param *source
 */

module.exports = Config = (function() {

  /**
   * Constructor.
   */
  function Config() {
    var source, _i, _len;
    this.parser(require);
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      source = arguments[_i];
      this.source(source);
    }
  }


  /**
   * Simply route to _load().
   */

  Config.prototype.reload = function() {
    return this._load.apply(this, arguments);
  };

  return Config;

})();


/**
 * Mixins.
 */

carcass.mixable(Config);

Config.prototype.mixin(require('../proto/config'));

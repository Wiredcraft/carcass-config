var carcass;

carcass = require('carcass');


/**
 * Mixin this so your object / instance becomes a config consumer.
 *
 * The simplest way of using config is use a config manager directly. This proto
 *   is just a nice convention where a consumer is an instance of a certain
 *   class; it has an id, and only uses a subset of config from the manager.
 */

module.exports = {

  /**
   * A manager is an instance mixed in the configManger proto.
   *
   * @type {Function}
   */
  configManager: carcass.helpers.accessor('_configManager'),

  /**
   * TODO: ?
   *
   * @type {Function}
   */
  configPrefix: carcass.helpers.accessor('_configPrefix'),

  /**
   * A name is used to get the config from the manager.
   */
  configName: carcass.helpers.accessor('_configName', {
    getDefault: function() {
      var _ref, _ref1;
      return (_ref = (_ref1 = this._id) != null ? _ref1 : this.constructor.name) != null ? _ref : null;
    }
  }),

  /**
   * Retrieve config.
   */
  config: function() {
    var manager, name;
    manager = this.configManager();
    if (manager == null) {
      return;
    }
    name = this.configName();
    if (name == null) {
      return;
    }
    return manager.get(name);
  }
};

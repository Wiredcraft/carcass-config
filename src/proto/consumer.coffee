carcass = require('carcass')

###*
 * Mixin this so your object / instance becomes a config consumer.
 *
 * The simplest way of using config is use a config manager directly. This proto
 *   is just a nice convention where a consumer is an instance of a certain
 *   class; it has an id, and only uses a subset of config from the manager.
###
module.exports = {
    ###*
     * A manager is an instance mixed in the configManger proto.
     *
     * @type {Function}
    ###
    configManager: carcass.helpers.accessor('_configManager')

    ###*
     * TODO: ?
     *
     * @type {Function}
    ###
    configPrefix: carcass.helpers.accessor('_configPrefix')

    ###*
     * A name is used to get the config from the manager.
    ###
    configName: carcass.helpers.accessor('_configName', {
        getDefault: ->
            # Use the instance id if available.
            # Use the class name if available.
            return @_id ? @constructor.name ? null
    })

    ###*
     * Retrieve config.
    ###
    config: ->
        manager = @configManager()
        return if not manager?
        name = @configName()
        return if not name?
        return manager.get(name)
}

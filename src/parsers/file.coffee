fs = require('fs')

###*
 * Read file.
 *
 * @return {String} the file content
###
module.exports = (item) ->
    return if not fs.existsSync(item)
    return fs.readFileSync(item, 'utf8')

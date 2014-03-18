fs = require('fs')

module.exports = (item) ->
    return if not fs.existsSync(item)
    return fs.readFileSync(item, 'utf8')

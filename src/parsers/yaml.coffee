###*
 * YAML parser.
 *
 * Used to parse a string and cannot be used together with `parsers.cjson`.
 *
 * @see https://github.com/nodeca/js-yaml#safeload-string---options-
###
module.exports = require('js-yaml').safeLoad

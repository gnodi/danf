'use strict';

/**
 * Expose `Logger`.
 */
module.exports = Logger;

/**
 * Initialize a new logger.
 */
function Logger() {
}

Logger.defineImplementedInterfaces(['danf:logging.logger']);

Logger.defineDependency('_chalk', 'object');

/**
 * Set chalk lib.
 *
 * @param {object}
 * @api public
 */
Object.defineProperty(Logger.prototype, 'chalk', {
    set: function(chalk) { this._chalk = chalk; }
});

/**
 * @interface {danf:logging.logger}
 */
Logger.prototype.log = function(message) {
    console.log(this._chalk.red(message));
}
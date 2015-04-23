'use strict';

/**
 * Expose `Uppercaser`.
 */
module.exports = Logger;
/**
 * Initialize a new logger.
 */
function Logger() {}

Logger.defineImplementedInterfaces(['logger']);

/**
 * @interface {logger}
 */
Logger.prototype.log = function(message) {
    console.log(message);
}
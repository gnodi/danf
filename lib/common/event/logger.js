'use strict';

/**
 * Expose `Logger`.
 */
module.exports = Logger;

/**
 * Initialize a new logger.
 */
function Logger() {
    this._counter = 0;
}

Logger.defineImplementedInterfaces(['danf:event.logger']);

Logger.defineDependency('_logger', 'danf:logging.logger');

/**
 * Set the logger.
 *
 * @param {danf:logging.logger}
 * @api public
 */
Object.defineProperty(Logger.prototype, 'logger', {
    set: function(logger) { this._logger = logger; }
});

/**
 * @interface {danf:event.logger}
 */
Logger.prototype.log = function(message, verbosity, indentation, item) {
    indentation = indentation ? indentation : 0;

    var flow = this.__asyncFlow;

    if (flow) {
        indentation += flow.level;
        message += '   ({0})'.format(null != item ? item : flow.currentTributary);
    }

    this._logger.log(message, verbosity, indentation);
}
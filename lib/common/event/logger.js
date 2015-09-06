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
Logger.prototype.log = function(message, verbosity, indentation, tributary, level, startedAt) {
    indentation = indentation ? indentation : 0;

    var flow = this.__asyncFlow;

    tributary = null != tributary ? tributary : flow.currentTributary;
    indentation += null != level ? level : flow.getTributaryLevel(tributary);

    var displayedMessage = '<<grey>>[{0}-{1}]<</grey>> '.format(
            flow.id.substr(0, 8),
            tributary
        )
    ;

    for (var i = 0; i < indentation; i++) {
        displayedMessage += '  ';
    }

    displayedMessage += message;

    if (startedAt) {
        displayedMessage += ' <<grey>>({0}ms)'.format(Date.now() - startedAt.getTime());
    }

    this._logger.log(displayedMessage, verbosity, 0);
}
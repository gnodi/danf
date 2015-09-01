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

Logger.defineDependency('_verbosity', 'number');
Logger.defineDependency('_chalk', 'object');

/**
 * Set verbosity level.
 *
 * @param {number}
 * @api public
 */
Object.defineProperty(Logger.prototype, 'verbosity', {
    set: function(verbosity) { this._verbosity = verbosity; }
});

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
Logger.prototype.log = function(message, verbosity, indentation, style) {
    // Do not log higher verbosity levels.
    // The lower is the verbosity level the lower is the verbosity.
    if (verbosity > this._verbosity) {
        return;
    }

    var parts = message.split(/<<(\/?[\w-]+)>>/),
        displayedMessage = '',
        attributes = {},
        indentation = indentation ? indentation : 0
    ;

    for (var i = 0; i < indentation; i++) {
        displayedMessage += '  ';
    }

    for (var i = 0; i < parts.length; i++) {
        if (0 === i % 2) {
            var style = this._chalk;

            for (var attribute in attributes) {
                if (style[attribute]) {
                    style = style[attribute];
                }
            }

            displayedMessage += this._chalk === style
                ? parts[i]
                : style(parts[i])
            ;
        } else {
            var remove = '/' === parts[i].charAt(0),
                partAttributes = (remove ? parts[i].substr(1) : parts[i]).split('-')
            ;

            for (var j = 0; j < partAttributes.length; j++) {
                var attribute = partAttributes[j];

                if (remove) {
                    delete attributes[attribute];
                } else {
                    attributes[attribute] = true;
                }
            }
        }
    }

    console.log(displayedMessage);
}
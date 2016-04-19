'use strict';

/**
 * Expose `Logger`.
 */
module.exports = Logger;

/**
 * Initialize a new logger.
 */
function Logger() {
    this._styles = {};
}

Logger.defineImplementedInterfaces(['danf:logging.logger']);

Logger.defineDependency('_verbosity', 'number');
Logger.defineDependency('_styles', 'string_object');
Logger.defineDependency('_chalk', 'object|null');

/**
 * Verbosity level.
 *
 * @var {number}
 * @api public
 */
Object.defineProperty(Logger.prototype, 'verbosity', {
    set: function(verbosity) { this._verbosity = verbosity; }
});

/**
 * Styles.
 *
 * @var {string_object}
 * @api public
 */
Object.defineProperty(Logger.prototype, 'styles', {
    set: function(styles) { this._styles = styles; }
});

/**
 * Chalk lib.
 *
 * @var {object}
 * @api public
 */
Object.defineProperty(Logger.prototype, 'chalk', {
    set: function(chalk) { this._chalk = chalk; }
});

/**
 * @interface {danf:logging.logger}
 */
Logger.prototype.log = function(value, verbosity, indentation, length) {
    // Do not log higher verbosity levels.
    // The lower is the verbosity level the lower is the verbosity.
    if (verbosity > this._verbosity) {
        return;
    }

    if ('string' === typeof value) {
        if (length) {
            if (value.length > length) {
                value = '{0}<<bold>><<grey>>...'.format(
                    value.substr(0, length)
                )
            }
        }

        var parts = value.split(/<<(\/?[\w-]+)>>/),
            displayedMessage = '',
            attributes = {},
            indentation = indentation ? indentation : 0
        ;

        for (var i = 0; i < indentation; i++) {
            displayedMessage += '  ';
        }

        for (var i = 0; i < parts.length; i++) {
            if (0 === i % 2) {
                var style = this._chalk || {};

                for (var attribute in attributes) {
                    if (style[attribute]) {
                        style = style[attribute];
                    }
                }

                displayedMessage += this._chalk === style || null == this._chalk
                    ? parts[i]
                    : style(parts[i])
                ;
            } else {
                var remove = '/' === parts[i].charAt(0);

                attributes = setAttributes.call(
                    this,
                    (remove ? parts[i].substr(1) : parts[i]).split('-'),
                    attributes,
                    remove
                );
            }
        }

        console.log(displayedMessage);
    } else {
        console.log(value);
    }
}

/**
 * Add or remove attributes.
 *
 * @param {string_array} affectedAttributes The affected attributes.
 * @param {boolean_object} attributes The current attributes list.
 * @param {boolean} remove Whether or not it is a removing of attributes.
 * @return {boolean_object} attributes The new attributes list.
 * @api private
 */
var setAttributes = function(affectedAttributes, attributes, remove) {
    for (var j = 0; j < affectedAttributes.length; j++) {
        var attribute = affectedAttributes[j];

        if (this._styles[attribute]) {
            attributes = setAttributes.call(
                this,
                this._styles[attribute].split('-'),
                attributes,
                remove
            );
        } else {
            if (remove) {
                delete attributes[attribute];
            } else {
                attributes[attribute] = true;
            }
        }
    }

    return attributes;
}
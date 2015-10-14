'use strict';

/**
 * Expose `Escaper`.
 */
module.exports = Escaper;

/**
 * Initialize a new escaper.
 */
function Escaper() {
}

Escaper.defineImplementedInterfaces(['danf:manipulation.escaper']);

/**
 * @interface {danf:manipulation.escaper}
 */
Escaper.prototype.escape = function(source, strings) {
    if ('object' === typeof source && undefined === source.__metadata) {
        for (var key in source) {
            source[key] = this.escape(source[key], strings);
        }
    } else if ('string' === typeof source) {
        for (var i in strings) {
            var string = strings[i];

            source = source.replace(
                new RegExp(string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'g'), '\\{0}\\'.format(string)
            );
        }
    }

    return source;
}

/**
 * @interface {danf:manipulation.escaper}
 */
Escaper.prototype.unescape = function(source, strings) {
    if ('object' === typeof source && undefined === source.__metadata) {
        for (var key in source) {
            source[key] = this.unescape(source[key], strings);
        }
    } else if ('string' === typeof source) {
        for (var i in strings) {
            var string = strings[i];

            source = source.replace(
                new RegExp('\\\\{0}\\\\'.format(string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')), 'g'), string
            );
        }
    }

    return source;
}
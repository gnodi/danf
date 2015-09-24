'use strict';

/**
 * Expose `BodyProvider`.
 */
module.exports = BodyProvider;

/**
 * Initialize a new body provider.
 */
function BodyProvider() {
}

BodyProvider.defineImplementedInterfaces(['danf:manipulation.bodyProvider']);

BodyProvider.defineDependency('_jquery', 'function');

/**
 * Set JQuery.
 *
 * @param {function}
 * @api public
 */
Object.defineProperty(BodyProvider.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * @interface {danf:manipulation.bodyProvider}
 */
BodyProvider.prototype.provide = function(dom) {
    var $ = this._jquery,
        body = $('#body')
    ;

    if (0 === body.length) {
        body = $(document.body);
    }

    return body;
}
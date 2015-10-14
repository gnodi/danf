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
 * JQuery.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(BodyProvider.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * @interface {danf:manipulation.bodyProvider}
 */
BodyProvider.prototype.provide = function(doc) {
    var $ = this._jquery,
        fromSpecificDocument = doc ? true : false,
        doc = fromSpecificDocument ? $(doc) : $(document)
    ;

    if (fromSpecificDocument) {
        var wrapper = $(document.createElement('div'));

        wrapper.wrapInner(doc);
        doc = wrapper;
    }

    var body = doc.find('#body')

    if (0 === body.length) {
        if (fromSpecificDocument) {
            body = doc.find('body');

            if (body.length === 0) {
                body = doc;
            }
        } else {
            body = $(document.body);
        }
    }

    return body;
}
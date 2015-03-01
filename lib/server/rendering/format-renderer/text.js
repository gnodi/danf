'use strict';

/**
 * Expose `Text`.
 */
module.exports = Text;

/**
 * Initialize a new text type renderer.
 *
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 */
function Text(referenceResolver) {
    if (referenceResolver) {
        this.referenceResolver = referenceResolver;
    }
}

Text.defineImplementedInterfaces(['danf:rendering.formatRenderer']);

Text.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Text.prototype, 'format', {
    value: 'text'
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Text.prototype, 'contentTypeHeader', {
    value: 'text/plain'
});


/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Text.prototype, 'contract', {
    value: {
        value: {
            type: 'string'
        }
    }
});

/**
 * Set the reference resolver.
 *
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 * @api public
 */
Object.defineProperty(Text.prototype, 'referenceResolver', {
    set: function(referenceResolver) {
        this._referenceResolver = referenceResolver
    }
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Text.prototype.render = function(response, context, config, callback) {
    var text = this._referenceResolver.resolve(
        config.value,
       '@',
        context
    );

    callback(text);
}
'use strict';

/**
 * Expose `Json`.
 */
module.exports = Json;

/**
 * Initialize a new json type renderer.
 */
function Json() {
}

Json.defineImplementedInterfaces(['danf:rendering.formatRenderer']);

/**
 * Reference resolver.
 *
 * @var {danf:manipulation.referenceResolver}
 * @api public
 */
Object.defineProperty(Json.prototype, 'referenceResolver', {
    set: function(referenceResolver) {
        this._referenceResolver = referenceResolver
    }
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Json.prototype, 'format', {
    value: 'json'
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Json.prototype, 'contentTypeHeader', {
    value: 'application/json'
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Json.prototype, 'contract', {
    value: {
        value: {
            type: 'mixed'
        }
    }
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Json.prototype.render = function(response, context, config, callback) {
    var rendering = null != config.value
            ? resolveReferences.call(
                this,
                config.value,
                context
            )
            : context
    ;

    callback(JSON.stringify(rendering));
}

/**
 * Resolve references of a source.
 *
 * @param {mixed} source The source.
 * @param {object} context The resolving context.
 */
var resolveReferences = function(source, context) {
    switch (typeof source) {
        case 'object':
            var obj = {};

            for (var key in source) {
                obj[key] = resolveReferences.call(
                    this,
                    source[key],
                    context
                );
            }

            source = obj;

            break;
        case 'string':
            source = this._referenceResolver.resolve(
                source,
                '@',
                context
            );

            break;
    }

    return source;
}
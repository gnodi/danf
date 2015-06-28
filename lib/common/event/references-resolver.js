'use strict';

/**
 * Expose `ReferencesResolver`.
 */
module.exports = ReferencesResolver;

/**
 * Initialize a new sequences references resolver.
 *
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 * @param {object} config The config.
 */
function ReferencesResolver(referenceResolver, config) {
    if (config) {
        this.config = config;
    }
    if (referenceResolver) {
        this.referenceResolver = referenceResolver;
    }
}

ReferencesResolver.defineImplementedInterfaces(['danf:event.referencesResolver']);

ReferencesResolver.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');

/**
 * Set the reference resolver.
 *
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 * @api public
 */
Object.defineProperty(ReferencesResolver.prototype, 'referenceResolver', {
    set: function(referenceResolver) {
        this._referenceResolver = referenceResolver
    }
});

/**
 * Set the config.
 *
 * @param {object} The config.
 * @api public
 */
Object.defineProperty(ReferencesResolver.prototype, 'config', {
    set: function(config) { this._config = config; }
});

/**
 * @interface {danf:event.referencesResolver}
 */
ReferencesResolver.prototype.resolve = function(source, context) {
    var resolvedReferences = source;

    if (source && 'object' === typeof source) {
        resolvedReferences = Array.isArray(source) ? [] : {};

        for (var key in source) {
            resolvedReferences[key] = this.resolve(source[key], context);
        }
    } else if ('string' === typeof resolvedReferences) {
        resolvedReferences = this._referenceResolver.resolve(resolvedReferences, '@', context);

        if ('string' === typeof resolvedReferences) {
            resolvedReferences = this._referenceResolver.resolve(resolvedReferences, '$', this._config);
        }
    }

    return resolvedReferences;
}

/**
 * @interface {danf:event.referencesResolver}
 */
ReferencesResolver.prototype.resolveSpecific = function(source, type, context) {
    var resolvedReferences = source;

    if (source && 'object' === typeof source) {
        resolvedReferences = Array.isArray(source) ? [] : {};

        for (var key in source) {
            resolvedReferences[key] = this.resolve(source[key], context);
        }
    } else if ('string' === typeof resolvedReferences) {
        resolvedReferences = this._referenceResolver.resolve(resolvedReferences, type, context);
    }

    return resolvedReferences;
}
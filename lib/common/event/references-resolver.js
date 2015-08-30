'use strict';

/**
 * Expose `ReferencesResolver`.
 */
module.exports = ReferencesResolver;

/**
 * Initialize a new sequences references resolver.
 *
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 * @param {danf:event.flowContext} flowContext The flow context.
 * @param {object} config The config.
 */
function ReferencesResolver(referenceResolver, flowContext, config) {
    if (referenceResolver) {
        this.referenceResolver = referenceResolver;
    }
    if (flowContext) {
        this.flowContext = flowContext;
    }
    if (config) {
        this.config = config;
    }
}

ReferencesResolver.defineImplementedInterfaces(['danf:event.referencesResolver']);

ReferencesResolver.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');
ReferencesResolver.defineDependency('_flowContext', 'danf:event.flowContext');
ReferencesResolver.defineDependency('_config', 'object');

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
 * Set the flow context.
 *
 * @param {danf:event.flowContext} The flow context.
 * @api public
 */
Object.defineProperty(ReferencesResolver.prototype, 'flowContext', {
    set: function(flowContext) {
        this._flowContext = flowContext
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
ReferencesResolver.prototype.resolve = function(source, context, inText) {
    var resolvedReferences = source;

    if (source && 'object' === typeof source) {
        resolvedReferences = Array.isArray(source) ? [] : {};

        for (var key in source) {
            resolvedReferences[key] = this.resolve(source[key], context);
        }
    } else if ('string' === typeof resolvedReferences) {
        resolvedReferences = this._referenceResolver.resolve(resolvedReferences, '@', context, inText);

        if ('string' === typeof resolvedReferences) {
            resolvedReferences = this._referenceResolver.resolve(resolvedReferences, '$', this._config, inText);
        }

        if ('string' === typeof resolvedReferences) {
            resolvedReferences = this._referenceResolver.resolve(resolvedReferences, '!', this._flowContext.getAll(), inText);
        }
    }

    return resolvedReferences;
}

/**
 * @interface {danf:event.referencesResolver}
 */
ReferencesResolver.prototype.resolveSpecific = function(source, type, context, inText) {
    var resolvedReferences = source;

    if (source && 'object' === typeof source) {
        resolvedReferences = Array.isArray(source) ? [] : {};

        for (var key in source) {
            resolvedReferences[key] = this.resolve(source[key], context);
        }
    } else if ('string' === typeof resolvedReferences) {
        resolvedReferences = this._referenceResolver.resolve(resolvedReferences, type, context, inText);
    }

    return resolvedReferences;
}
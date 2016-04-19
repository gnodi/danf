'use strict';

/**
 * Expose `ReferencesResolver`.
 */
module.exports = ReferencesResolver;

/**
 * Initialize a new sequences references resolver.
 */
function ReferencesResolver() {
}

ReferencesResolver.defineImplementedInterfaces(['danf:sequencing.referencesResolver']);

ReferencesResolver.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');
ReferencesResolver.defineDependency('_flowContext', 'danf:sequencing.flowContext');
ReferencesResolver.defineDependency('_config', 'object');

/**
 * Reference resolver.
 *
 * @var {danf:manipulation.referenceResolver}
 * @api public
 */
Object.defineProperty(ReferencesResolver.prototype, 'referenceResolver', {
    set: function(referenceResolver) {
        this._referenceResolver = referenceResolver
    }
});

/**
 * Flow context.
 *
 * @var {danf:sequencing.flowContext}
 * @api public
 */
Object.defineProperty(ReferencesResolver.prototype, 'flowContext', {
    set: function(flowContext) {
        this._flowContext = flowContext
    }
});

/**
 * Config.
 *
 * @var {object}
 * @api public
 */
Object.defineProperty(ReferencesResolver.prototype, 'config', {
    set: function(config) { this._config = config; }
});

/**
 * @interface {danf:sequencing.referencesResolver}
 */
ReferencesResolver.prototype.resolve = function(source, context, inText) {
    var resolvedReferences = source;

    resolvedReferences = this._referenceResolver.resolve(resolvedReferences, '@', context, inText);
    resolvedReferences = this._referenceResolver.resolve(resolvedReferences, '$', this._config, inText);
    resolvedReferences = this._referenceResolver.resolve(resolvedReferences, '!', this._flowContext.getAll(), inText);

    return resolvedReferences;
}

/**
 * @interface {danf:sequencing.referencesResolver}
 */
ReferencesResolver.prototype.resolveSpecific = function(source, type, context, inText) {
    var resolvedReferences = source;

    if ('$' === type && null == context) {
        context = this._config;
    } else if ('!' === type && null == context) {
        context = this._flowContext.getAll();
    }

    resolvedReferences = this._referenceResolver.resolve(resolvedReferences, type, context, inText);

    return resolvedReferences;
}
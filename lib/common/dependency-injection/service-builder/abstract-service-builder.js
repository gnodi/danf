'use strict';

/**
 * Expose `AbstractServiceBuilder`.
 */
module.exports = AbstractServiceBuilder;

/**
 * Initialize a new abstract service builder.
 */
function AbstractServiceBuilder() {
}

AbstractServiceBuilder.defineImplementedInterfaces(['danf:dependencyInjection.serviceBuilder']);

AbstractServiceBuilder.defineAsAbstract();

AbstractServiceBuilder.defineDependency('_servicesContainer', 'danf:dependencyInjection.servicesContainer');
AbstractServiceBuilder.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');

/**
 * Set the services container.
 *
 * @param {danf:dependencyInjection.servicesContainer} The services container.
 * @api public
 */
Object.defineProperty(AbstractServiceBuilder.prototype, 'servicesContainer', {
    set: function(servicesContainer) {
        this._servicesContainer = servicesContainer
    }
});

/**
 * Set the reference resolver.
 *
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 * @api public
 */
Object.defineProperty(AbstractServiceBuilder.prototype, 'referenceResolver', {
    set: function(referenceResolver) {
        this._referenceResolver = referenceResolver
    }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(AbstractServiceBuilder.prototype, 'defineOrder', {
    get: function() { return this._defineOrder; }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(AbstractServiceBuilder.prototype, 'instantiateOrder', {
    get: function() { return this._instantiateOrder; }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
AbstractServiceBuilder.prototype.define = function(service) {
    return service;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
AbstractServiceBuilder.prototype.merge = function(parent, child) {
    return child;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
AbstractServiceBuilder.prototype.instantiate = function(instance, definition) {
    return instance;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
AbstractServiceBuilder.prototype.finalize = function(instance, definition) {
    return instance;
}


/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
AbstractServiceBuilder.prototype.update = function(instance, definition) {
    return this.instantiate(instance, definition);
}
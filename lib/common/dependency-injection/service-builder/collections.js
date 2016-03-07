'use strict';

/**
 * Expose `Collections`.
 */
module.exports = Collections;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new collections service builder.
 */
function Collections() {
    AbstractServiceBuilder.call(this);

    this._defineOrder = 1800;
    this._instantiateOrder = 1200;

    this._collections = {};
}

utils.extend(AbstractServiceBuilder, Collections);

Collections.defineDependency('_interfacer', 'danf:object.interfacer');

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(Collections.prototype, 'contract', {
    value: {
        collections: {
            type: 'string_array',
            namespace: true
        }
    }
});

/**
 * Interfacer.
 *
 * @var {danf:object.interfacer}
 * @api public
 */
Object.defineProperty(Collections.prototype, 'interfacer', {
    set: function(interfacer) { this._interfacer = interfacer; }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Collections.prototype.define = function(definition) {
    if (definition.collections && !definition.abstract) {
        for (var i = 0; i < definition.collections.length; i++) {
            var collection = definition.collections[i];

            if (!this._collections[collection]) {
                this._collections[collection] = [];
            }

            var hasCollection = false;

            for (var j = 0; j < this._collections[collection].length; j++) {
                var serviceId = this._collections[collection][j];

                if (serviceId === definition.id) {
                    hasCollection = true;
                }
            }

            if (!hasCollection) {
                this._collections[collection].push(definition.id);
            }
        }
    }

    return definition;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Collections.prototype.merge = function(parent, child) {
    if (null != parent.collections) {
        if (null == child.collections) {
            child.collections = [];
        }

        for (var i = 0; i < parent.collections.length; i++) {
            var hasCollection = false,
                parentCollection = parent.collections[i]
            ;

            for (var j = 0; j < child.collections.length; j++) {
                if (child.collections[j] === parentCollection) {
                    hasCollection = true;
                }
            }

            if (!hasCollection) {
                child.collections.push(parentCollection);
            }
        }
    }

    return child;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Collections.prototype.instantiate = function(instance, definition) {
    for (var propertyName in definition.properties) {
        var propertyValue = definition.properties[propertyName];

        if ('string' === typeof propertyValue) {
            propertyValue = resolveCollection.call(this, definition, propertyValue, propertyName);
        }

        definition.properties[propertyName] = propertyValue;
    }

    return instance;
}

/**
 * Resolve a collection.
 *
 * @param {string} id The definition of the service owning the reference.
 * @param {string} source The string where the reference may occur.
 * @param {string} property The property name.
 * @return {mixed} The instantiation of the services defining the collection.
 * @api private
 */
var resolveCollection = function(definition, source, property) {
    var collectionName = this._referenceResolver.extract(
            source,
            '&',
            'the definition of the service "{0}"'.format(definition.id)
        )
    ;

    if (collectionName) {
        var collection = this._collections[collectionName[0]];

        if (!collection) {
            return [];
        }

        var services = [],
            dependencies = definition.class.__metadata.dependencies,
            interfaceName
        ;

        if (dependencies) {
            if (dependencies[property]) {
                interfaceName = dependencies[property].type;
            } else if (dependencies['_{0}'.format(property)]) {
                interfaceName = dependencies['_{0}'.format(property)].type;
            }

            if (interfaceName) {
                interfaceName = interfaceName.replace(/(_array|_object)/g, '');
            }
        }

        for (var i = 0; i < collection.length; i++) {
            var serviceId = collection[i];

            if (this._servicesContainer.hasDefinition(serviceId)) {
                var definition = this._servicesContainer.getDefinition(serviceId);

                if (definition.abstract) {
                    continue;
                }
            }

            var service = this._servicesContainer.get(serviceId);

            service = interfaceName && Object.isInterfaceType(interfaceName)
                ? this._interfacer.addProxy(service, interfaceName)
                : service
            ;

            services.push(service);

            // Mark dependencies for service runtime replacement.
            this._servicesContainer.setDependency(serviceId, definition.id, property, services.length);
        }

        return services;
    }

    return source;
}
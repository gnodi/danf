'use strict';

/**
 * Expose `Tags`.
 */
module.exports = Tags;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new tags service builder.
 *
 * @param {danf:dependencyInjection.servicesContainer} The services container.
 * @param {danf:manipulation.referenceResolver} The reference resolver.
 * @param {danf:object.interfacer} The interfacer.
 */
function Tags(servicesContainer, referenceResolver, interfacer) {
    AbstractServiceBuilder.call(this, servicesContainer, referenceResolver);

    this._defineOrder = 1800;
    this._instantiateOrder = 2000;

    this._tags = {};

    if (interfacer) {
        this.interfacer = interfacer;
    }
}

utils.extend(AbstractServiceBuilder, Tags);

Tags.defineDependency('_interfacer', 'danf:object.interfacer');

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(Tags.prototype, 'contract', {
    value: {
        tags: {
            type: 'string_array',
            namespaces: true
        }
    }
});

/**
 * Set the interfacer.
 *
 * @param {danf:object.interfacer} The interfacer.
 * @api public
 */
Object.defineProperty(Tags.prototype, 'interfacer', {
    set: function(interfacer) { this._interfacer = interfacer; }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Tags.prototype.define = function(service) {
    if (service.tags && !service.abstract) {
        for (var i = 0; i < service.tags.length; i++) {
            var tag = service.tags[i];

            if (!this._tags[tag]) {
                this._tags[tag] = [];
            }

            var isAlreadyTagged = false;

            for (var j = 0; j < this._tags[tag].length; j++) {
                var serviceId = this._tags[tag][j];

                if (serviceId === service.id) {
                    isAlreadyTagged = true;
                }
            }

            if (!isAlreadyTagged) {
                this._tags[tag].push(service.id);
            }
        }
    }

    return service;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Tags.prototype.merge = function(parent, child) {
    if (null != parent.tags) {
        if (null == child.tags) {
            child.tags = [];
        }

        for (var i = 0; i < parent.tags.length; i++) {
            var isAlreadyTagged = false,
                parentTag = parent.tags[i]
            ;

            for (var j = 0; j < child.tags.length; j++) {
                if (child.tags[j] === parentTag) {
                    isAlreadyTagged = true;
                }
            }

            if (!isAlreadyTagged) {
                child.tags.push(parentTag);
            }
        }
    }

    return child;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Tags.prototype.instantiate = function(instance, definition) {
    for (var propertyName in definition.properties) {
        var propertyValue = definition.properties[propertyName];

        if ('string' === typeof propertyValue) {
            propertyValue = resolveTag.call(this, definition, propertyValue, propertyName);
        }

        definition.properties[propertyName] = propertyValue;
    }

    return instance;
}

/**
 * Resolve a tag.
 *
 * @param {string} id The definition of the service owning the reference.
 * @param {string} source The string where the reference may occur.
 * @param {string} property The property name.
 * @return {mixed} The instantiation of the services defining the tag.
 * @api private
 */
var resolveTag = function(definition, source, property) {
    var tagName = this._referenceResolver.extract(
            source,
            '&',
            'the definition of the service "{0}"'.format(definition.id)
        )
    ;

    if (tagName) {
        var tag = this._tags[tagName[0]];

        if (!tag) {
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

        for (var i = 0; i < tag.length; i++) {
            var serviceId = tag[i];

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
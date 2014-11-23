'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('danf/utils') : require('../../utils'),
        AbstractServiceBuilder = module.isClient ? require('danf/dependency-injection/service-builder/abstract-service-builder') : require('./abstract-service-builder')
    ;

    /**
     * Initialize a new tags service builder.
     *
     * @param {danf:dependencyInjection.servicesContainer} The services container.
     * @param {danf:manipulation.referenceResolver} The reference resolver.
     */
    function Tags(servicesContainer, referenceResolver) {
        AbstractServiceBuilder.call(this, servicesContainer, referenceResolver);

        this._defineOrder = 1800;
        this._instantiateOrder = 2000;

        this._tags = {};
    }

    utils.extend(AbstractServiceBuilder, Tags);

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
                propertyValue = resolveTag.call(this, definition.id, propertyValue, propertyName);
            }

            definition.properties[propertyName] = propertyValue;
        }

        return instance;
    }

    /**
     * Resolve a tag.
     *
     * @param {string} id The id of the service owning the reference.
     * @param {string} source The string where the reference may occur.
     * @param {string} property The property name.
     * @return {mixed} The instantiation of the services defining the tag.
     * @api private
     */
    var resolveTag = function(id, source, property) {
        var tagName = this._referenceResolver.extract(
                source,
                '&',
                'the definition of the service "{0}"'.format(id)
            )
        ;

        if (tagName) {
            var tag = this._tags[tagName[0]];

            if (!tag) {
                return [];
            }

            var services = [];

            for (var i = 0; i < tag.length; i++) {
                var serviceId = tag[i];

                if (this._servicesContainer.hasDefinition(serviceId)) {
                    var definition = this._servicesContainer.getDefinition(serviceId);

                    if (definition.abstract) {
                        continue;
                    }
                }

                var service = this._servicesContainer.get(serviceId);

                services.push(service);

                // Mark dependencies for service runtime replacement.
                this._servicesContainer.setDependency(serviceId, id, property, services.length);
            }

            return services;
        }

        return source;
    }

    /**
     * Expose `Tags`.
     */
    return Tags;
});
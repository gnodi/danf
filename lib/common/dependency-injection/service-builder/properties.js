'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = require('../../utils'),
        AbstractServiceBuilder = require('./abstract-service-builder')
    ;

    /**
     * Initialize a new properties service builder.
     *
     * @param {danf:dependencyInjection.servicesContainer} The services container.
     * @param {danf:manipulation.referenceResolver} The reference resolver.
     * @param {danf:object.interfacer} The interfacer.
     */
    function Properties(servicesContainer, referenceResolver, interfacer) {
        AbstractServiceBuilder.call(this, servicesContainer, referenceResolver);

        this._defineOrder = 800;
        this._instantiateOrder = 2200;

        if (interfacer) {
            this.interfacer = interfacer;
        }
    }

    utils.extend(AbstractServiceBuilder, Properties);

    Properties.defineDependency('_interfacer', 'danf:object.interfacer');

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Object.defineProperty(Properties.prototype, 'contract', {
        value: {
            properties: {
                type: 'mixed_object'
            }
        }
    });

    /**
     * Set the interfacer.
     *
     * @param {danf:object.interfacer} The interfacer.
     * @api public
     */
    Object.defineProperty(Properties.prototype, 'interfacer', {
        set: function(interfacer) { this._interfacer = interfacer; }
    });

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Properties.prototype.define = function(service) {
        if (!service.properties) {
            service.properties = {};
        }

        return service;
    }

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Properties.prototype.merge = function(parent, child) {
        var properties = child.properties || {};

        for (var propertyName in parent.properties) {
            if (undefined === properties[propertyName]) {
                properties[propertyName] = parent.properties[propertyName];
            }
        }

        child.properties = properties;

        return child;
    }

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Properties.prototype.instantiate = function(instance, definition) {
        for (var propertyName in definition.properties) {
            var propertyValue = definition.properties[propertyName];

            // Resolve references coming from the config.
            if ('string' === typeof propertyValue) {
                propertyValue = this._referenceResolver.resolve(
                    propertyValue,
                    '$',
                    this._servicesContainer.config,
                    'the definition of the service "{0}"'.format(definition.id)
                );
            }

            // Resolve services' references.
            if (Array.isArray(propertyValue)) {
                for (var i = 0; i < propertyValue.length; i++) {
                    if ('string' === typeof propertyValue[i]) {
                        propertyValue[i] = resolveServiceReference.call(this, definition, propertyValue[i], propertyName, i);
                    }
                }
            } else if ('string' === typeof propertyValue) {
                propertyValue = resolveServiceReference.call(this, definition, propertyValue, propertyName);
            }

            instance[propertyName] = propertyValue;
        }

        // Check that all dependencies have been passed.
        Object.checkDependencies(instance);

        return instance;
    }

    /**
     * Resolve a service reference.
     *
     * @param {object} definition The definition of the service owning the reference.
     * @param {string} source The string where the reference may occur.
     * @param {string} property The property name.
     * @param {number|String} index The index of the property if the value of the property is an object.
     * @return {mixed} The instantiation of the service or the initial source if no reference found.
     * @api private
     */
    var resolveServiceReference = function(definition, source, property, index) {
        var serviceReference = this._referenceResolver.extract(
                source,
                '#',
                'the definition of the service "{0}"'.format(definition.id)
            )
        ;

        if (serviceReference) {
            var serviceId = serviceReference[0];

            if (!this._servicesContainer.hasDefinition(serviceId) && !this._servicesContainer.has(serviceId)) {
                throw new Error(
                    'The service of id "{0}" has a dependency on a not defined service "{1}".'.format(
                        definition.id,
                        serviceId
                    )
                );
            }

            // Mark dependencies for service runtime replacement.
            this._servicesContainer.setDependency(serviceId, definition.id, property, index);

            var service = this._servicesContainer.get(serviceId),
                dependencies = definition.class.__metadata.dependencies,
                interfaceName
            ;

            // Check for decoupled dependency.
            if (dependencies) {
                if (dependencies[property]) {
                    interfaceName = dependencies[property].type;
                } else if (dependencies['_{0}'.format(property)]) {
                    interfaceName = dependencies['_{0}'.format(property)].type;
                }
            }

            // Add a proxy if this is a decoupled dependency.
            return interfaceName && Object.isInterfaceType(interfaceName) ? this._interfacer.addProxy(service, interfaceName) : service;
        }

        return source;
    }

    /**
     * Expose `Properties`.
     */
    return Properties;
});
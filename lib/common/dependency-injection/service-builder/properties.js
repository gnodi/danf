'use strict';

/**
 * Expose `Properties`.
 */
module.exports = Properties;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new properties service builder.
 */
function Properties() {
    AbstractServiceBuilder.call(this);

    this._defineOrder = 800;
    this._instantiateOrder = 2400;
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
 * Set the modules tree.
 *
 * @param {danf:configuration.modulesTree} modulesTree The modules tree.
 * @api public
 */
Object.defineProperty(Properties.prototype, 'modulesTree', {
    set: function(modulesTree) { this._modulesTree = modulesTree; }
});

/**
 * Set the namespacer.
 *
 * @param {danf:configuration.namespacer} namespacer The namespacer.
 * @api public
 */
Object.defineProperty(Properties.prototype, 'namespacer', {
    set: function(namespacer) { this._namespacer = namespacer; }
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
        if ('object' === typeof propertyValue) {
            for (var key in propertyValue) {
                if ('string' === typeof propertyValue[key]) {
                    propertyValue[key] = resolveServiceReference.call(this, definition, instance, propertyValue[key], propertyName, key);
                }
            }
        } else if ('string' === typeof propertyValue) {
            propertyValue = resolveServiceReference.call(this, definition, instance, propertyValue, propertyName);
        }

        instance[propertyName] = propertyValue;
    }

    return instance;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Properties.prototype.finalize = function(instance, definition) {
    for (var propertyName in definition.properties) {
        var propertyValue = definition.properties[propertyName],
            hasChangedValue = false
        ;

        // Resolve services' references.
        if ('object' === typeof propertyValue) {
            for (var key in propertyValue) {
                if ('string' === typeof propertyValue[key]) {
                    var value = resolveServiceReference.call(this, definition, instance, propertyValue[key], propertyName, key, true);

                    if (value !== propertyValue[key]) {
                        propertyValue[key] = value;
                        hasChangedValue = true;
                    }
                }
            }
        } else if ('string' === typeof propertyValue) {
            var value = resolveServiceReference.call(this, definition, instance, propertyValue, propertyName, null, true);

            if (value !== propertyValue) {
                propertyValue = value;
                hasChangedValue = true;
            }
        }

        if (hasChangedValue) {
            instance[propertyName] = propertyValue;
        }
    }

    // Check that all dependencies have been passed.
    Object.checkDependencies(instance);

    // Call __init method.
    if ('function' === typeof instance.__init) {
        instance.__init();
    }

    return instance;
}

/**
 * Resolve a service reference.
 *
 * @param {object} definition The definition of the service owning the reference.
 * @param {object} instance The service owning the reference.
 * @param {string} source The string where the reference may occur.
 * @param {string} property The property name.
 * @param {number|string} index The index of the property if the value of the property is an object.
 * @param {boolean} resolveRegistries Whether or not to resolve registries.
 * @return {mixed} The instantiation of the service or the initial source if no reference found.
 * @api private
 */
var resolveServiceReference = function(definition, instance, source, property, index, resolveRegistries) {
    var serviceReference = this._referenceResolver.extract(
            source,
            '#',
            'the definition of the service "{0}"'.format(definition.id)
        )
    ;

    if (serviceReference) {
        serviceReference = serviceReference[0].match(/([^\[]+)((?:\[[^\]]+\])*)/);

        var serviceId = serviceReference[1],
            serviceItem = serviceReference[2]
        ;

        if (
            (!resolveRegistries && serviceItem) ||
            (resolveRegistries && !serviceItem)
        ) {
            return source;
        }

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
            object = service
        ;

        // Handle case of a registry dependency.
        if (serviceItem) {
            var serviceDefinition = this._servicesContainer.getDefinition(serviceId),
                itemIndexes = serviceItem.replace(/\[([^\]]+)\]/g, '$1|_-_|').split('|_-_|')
            ;

            itemIndexes.pop();

            if (!serviceDefinition.registry) {
                throw new Error(
                    'The service of id "{0}" uses the service "{1}" as a registry whereas it is not a registry.'.format(
                        definition.id,
                        serviceId
                    )
                );
            }

            // Handle case of a namespaced item.
            if (serviceDefinition.registry.namespace) {
                var moduleId = instance.__metadata.module;

                if (moduleId) {
                    var module = this._modulesTree.get(moduleId),
                        namespace = serviceDefinition.registry.namespace
                    ;

                    if (Array.isArray(namespace)) {
                        for (var i in namespace) {
                            var index = namespace[i];

                            if (itemIndexes[index]) {
                                itemIndexes[index] = this._namespacer.prefix(itemIndexes[index], module, this._modulesTree);
                            }
                        }
                    } else {
                        for (var index in itemIndexes) {
                            itemIndexes[index] = this._namespacer.prefix(itemIndexes[index], module, this._modulesTree);
                        }
                    }
                }
            }

            object = service[serviceDefinition.registry.method].apply(service, itemIndexes);
        }

        var interfaceName;

        if (instance.__metadata) {
            var dependencies = instance.__metadata.dependencies;

            // Check for decoupled dependency.
            if (dependencies) {
                if (dependencies[property]) {
                    interfaceName = dependencies[property].type;
                } else if (dependencies['_{0}'.format(property)]) {
                    interfaceName = dependencies['_{0}'.format(property)].type;
                }
            }
        }

        if (interfaceName) {
            var types = interfaceName.split('|');

            for (var i = 0; i < types.length; i++) {
                // Add a proxy if this is a decoupled dependency.
                if (Object.isInterfaceType(types[i])) {
                    return this._interfacer.addProxy(object, interfaceName);
                }
            }
        }

        return object;
    }

    return source;
}
'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient
            ? require('-/danf/utils')
            : require('../../utils')
    ;

    /**
     * Initialize a new services container.
     */
    function ServicesContainer(referenceResolver) {
        this._referenceResolver = referenceResolver;

        this._definitions = {};
        this._services = {};
        this._dependencies = {};
        this._aliases = {};
        this._config = {};

        this._serviceDefiners = [];
        this._serviceInstantiators = [];
        this._serviceBuilders = [];
        this._handledParameters = {};
        this._buildTree = [];
    }

    ServicesContainer.defineImplementedInterfaces(['danf:dependencyInjection.servicesContainer', 'danf:manipulation.registryObserver']);

    ServicesContainer.defineDependency('_serviceBuilders', 'danf:dependencyInjection.serviceBuilder_array');
    ServicesContainer.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    Object.defineProperty(ServicesContainer.prototype, 'config', {
        get: function() { return this._config; },
        set: function(config) { this._config = utils.clone(config); }
    });

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    Object.defineProperty(ServicesContainer.prototype, 'handledParameters', {
        get: function() { return this._handledParameters }
    });

    /**
     * Add a service builder.
     *
     * @param {danf:dependencyInjection.serviceBuilder} serviceBuilder The service builder.
     * @api public
     */
    ServicesContainer.prototype.addServiceBuilder = function(serviceBuilder) {
        Object.checkType(serviceBuilder, 'danf:dependencyInjection.serviceBuilder');

        var added = false,
            defineOrder = serviceBuilder.defineOrder,
            instantiateOrder = serviceBuilder.instantiateOrder
        ;

        // Register handled parameters.
        this._handledParameters = utils.merge(this._handledParameters, serviceBuilder.contract);

        // Register service definers.
        if (null != defineOrder) {
            for (var j = 0; j < this._serviceDefiners.length; j++) {
                var serviceDefiner = this._serviceDefiners[j];

                if (defineOrder < serviceDefiner.defineOrder) {
                    this._serviceDefiners.splice(j, 0, serviceBuilder);
                    added = true;

                    break;
                }
            }

            if (!added) {
                this._serviceDefiners.push(serviceBuilder);
            }
        }

        // Register service instantiators.
        if (null != instantiateOrder) {
            added = false;

            for (var j = 0; j < this._serviceInstantiators.length; j++) {
                var serviceInstantiator = this._serviceInstantiators[j];

                if (instantiateOrder < serviceInstantiator.instantiateOrder) {
                    this._serviceInstantiators.splice(j, 0, serviceBuilder);
                    added = true;

                    break;
                }
            }

            if (!added) {
                this._serviceInstantiators.push(serviceBuilder);
            }
        }

        // Register service builders.
        this._serviceBuilders.push(serviceBuilder);
    }

    /**
     * @interface {danf:manipulation.registryObserver}
     */
    ServicesContainer.prototype.handleRegistryChange = function(items, reset, name) {
        items = utils.clone(items);
        this._buildTree = [];

        // Reset the list of existing definitions.
        this._aliases = {};
        this._dependencies = {};

        // Remove the services with a definition.
        for (var id in this._services) {
            if (this.hasDefinition(id)) {
                var definition = this.getDefinition(id);

                if (!definition.lock) {
                    delete this._services[id];
                }
            }
        }

        this._definitions = {};

        if (!reset) {
            // Register all the definitions.
            for (var id in items) {
                var definition = items[id];

                definition.id = id;
                this._definitions[id] = definition;
            }

            // Check not handled definition parameters.
            for (var id in this._definitions) {
                var definition = this._definitions[id];

                for (var parameter in definition) {
                    if (!(parameter in {id: true, lock: true}) && !(parameter in this._handledParameters)) {
                        throw new Error(
                            'The parameter "{0}" is not handled by any of the service builders in the definition of the service "{1}".'.format(
                                parameter,
                                id
                            )
                        );
                    }
                }
            }

            // Define.
            for (var id in this._definitions) {
                this._definitions[id] = define.call(this, this._definitions[id]);
            }

            // Update the old instantiated services.
            for (var id in this._services) {
                if (this.hasDefinition(id)) {
                    update.call(this, id);
                }
            }

            // Instantiate the services.
            this.build(false);
        }
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.setAlias = function(alias, id) {
        this._aliases[alias] = id;
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.setDefinition = function(id, definition) {
        definition.id = id;
        this._definitions[id] = define.call(this, definition);
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.getDefinition = function(id) {
        if (!this.hasDefinition(id)) {
            throw new Error(
                'The service of id "{0}" does not exist.'.format(
                    id
                )
            );
        }

        return this._definitions[id];
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.hasDefinition = function(id) {
        return this._definitions[id] ? true : false;
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.mergeDefinitions = function(parent, child) {
        var merged = utils.clone(child);

        for (var i = 0; i < this._serviceBuilders.length; i++) {
            merged = this._serviceBuilders[i].merge(parent, merged);
        }

        return merged;
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.build = function(reset) {
        if (reset) {
            for (var serviceId in this._services) {
                if (this.hasDefinition(serviceId)) {
                    delete this._services[serviceId];
                }
            }
        }

        for (var serviceId in this._definitions) {
            if (!this._definitions[serviceId].abstract) {
                this.get(serviceId);
            }
        }
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.get = function(id) {
        id = this._aliases[id] ? this._aliases[id] : id;

        if (!this._services[id]) {
            for (var i = 0; i < this._buildTree.length; i++) {
                if (id === this._buildTree[i]) {
                    this._buildTree.push(id);

                    throw new Error(
                        'The circular dependency ["{0}"] prevent to build the service "{1}".'.format(
                            this._buildTree.join('" -> "'),
                            id
                        )
                    );
                }
            }

            this._buildTree.push(id);
            this._services[id] = instantiate.call(this, id);
            this._buildTree.pop();
        }

        return this._services[id];
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.set = function(id, service) {
        if ('string' !== typeof id) {
            throw new Error(
                'The id of a service must be a "string"; "{0}" given instead.'.format(
                    typeof id
                )
            );
        }

        if ('object' !== typeof service && 'function' !== typeof service) {
            throw new Error(
                'The service of id "{0}" must be an "object"; "{1}" given instead.'.format(
                    id,
                    typeof service
                )
            );
        }

        // Removing.
        if (null == service) {
            delete this._services[id];
        // Replacement.
        } else {
            this._services[id] = service;
        }

        // Impact the dependencies.
        var dependencies = this._dependencies[id];

        if (dependencies) {
            for (var dependencyId in dependencies) {
                var dependency = this.get(dependencyId);

                for (var propertyName in dependencies[dependencyId]) {
                    var index = dependencies[dependencyId][propertyName];

                    // Simple value.
                    if (null === index) {
                        dependency[propertyName] = service;
                    // Object value.
                    } else {
                        var propertyValue = dependency[propertyName];

                        if (null == propertyValue) {
                            if ('number' === typeof index) {
                                propertyValue = [];
                            } else {
                                propertyValue = {};
                            }
                        }

                        // Removing.
                        if (null == service) {
                            if (Array.isArray(propertyValue)) {
                                propertyValue.splice(index, 1);
                            } else {
                                delete propertyValue[index];
                            }
                        // Replacement.
                        } else {
                            propertyValue[index] = service;
                        }

                        dependency[propertyName] = propertyValue;
                    }
                }
            }
        }
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.unset = function(id) {
        delete this._services[id];
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.has = function(id) {
        return this._services[id] ? true : false;
    }

    /**
     * @interface {danf:dependencyInjection.servicesContainer}
     */
    ServicesContainer.prototype.setDependency = function(id, dependencyId, property, index) {
        if (!this._dependencies[id]) {
            this._dependencies[id] = {};
        }
        if (!this._dependencies[id][dependencyId]) {
            this._dependencies[id][dependencyId] = {};
        }
        this._dependencies[id][dependencyId][property] = index;
    }

    /**
     * Define a service.
     *
     * @param {Object} definition The service definition.
     * @return {object} The handled definition.
     * @api private
     */
    var define = function(definition) {
        for (var i = 0; i < this._serviceDefiners.length; i++) {
            definition = this._serviceDefiners[i].define(definition);
        }

        return definition;
    }

    /**
     * Instantiate a service and its dependencies.
     *
     * @param {String} id
     * @return {Object}
     * @api private
     */
    var instantiate = function(id) {
        var definition = utils.clone(this.getDefinition(id)),
            instance = null
        ;

        for (var i = 0; i < this._serviceInstantiators.length; i++) {
            instance = this._serviceInstantiators[i].instantiate(instance, definition);
        }

        return instance;
    }

    /**
     * Update an already instanciated service and its dependencies.
     *
     * @param {String} id
     * @return {Object}
     * @api private
     */
    var update = function(id) {
        var definition = utils.clone(this.getDefinition(id)),
            instance = this.get(id)
        ;

        for (var i = 0; i < this._serviceInstantiators.length; i++) {
            instance = this._serviceInstantiators[i].update(instance, definition);
        }

        return instance;
    }

    /**
     * Expose `ServicesContainer`.
     */
    return ServicesContainer;
});
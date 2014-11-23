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
     * Initialize a new parent service builder.
     *
     * @param {danf:dependencyInjection.servicesContainer} The services container.
     * @param {danf:manipulation.referenceResolver} The reference resolver.
     */
    function Parent(servicesContainer, referenceResolver) {
        AbstractServiceBuilder.call(this, servicesContainer, referenceResolver);

        this._defineOrder = 1000;
    }

    utils.extend(AbstractServiceBuilder, Parent);

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Object.defineProperty(Parent.prototype, 'contract', {
        value:  {
            parent: {
                type: 'string'
            }
        }
    });

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Parent.prototype.define = function(service) {
        if (service.parent) {
            service = processParent.call(this, service);
            delete service.parent;
        }

        return service;
    }

    /**
     * @interface {danf:dependencyInjection.serviceBuilder}
     */
    Parent.prototype.merge = function(parent, child) {
        if (null == child.class) {
            child.class = parent.class;
        }

        return child;
    }

    /**
     * Process the parent definitions of the definition.
     *
     * @param {object} definition The definition to process.
     * @return {object} The processed definition.
     * @api private
     */
    var processParent = function(service) {
        var parent = this._servicesContainer.getDefinition(service.parent);

        if (parent.parent) {
            parent = processParent.call(this, parent);
        }

        return this._servicesContainer.mergeDefinitions(parent, service);
    }

    /**
     * Expose `Parent`.
     */
    return Parent;
});
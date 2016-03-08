'use strict';

/**
 * Expose `Parent`.
 */
module.exports = Parent;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new parent service builder.
 */
function Parent() {
    AbstractServiceBuilder.call(this);

    this._defineOrder = 1000;
}

utils.extend(AbstractServiceBuilder, Parent);

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(Parent.prototype, 'contract', {
    value:  {
        parent: {
            type: 'string',
            namespace: true
        }
    }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Parent.prototype.define = function(definition) {
    if (definition.parent && !definition.abstract) {
        definition = processParent.call(this, definition);
        delete definition.parent;
    }

    return definition;
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
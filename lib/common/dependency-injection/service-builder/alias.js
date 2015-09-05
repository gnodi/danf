'use strict';

/**
 * Expose `Alias`.
 */
module.exports = Alias;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new alias service builder.
 */
function Alias() {
    AbstractServiceBuilder.call(this);

    this._defineOrder = 600;
}

utils.extend(AbstractServiceBuilder, Alias);

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(Alias.prototype, 'contract', {
    value: {
        alias: {
            type: 'string',
            namespace: true
        }
    }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Alias.prototype.define = function(service) {
    if (service.alias) {
        for (var parameter in service) {
            if (!(parameter in {'alias': true, 'id': true, 'lock': true, 'namespace': true})
                && undefined !== service[parameter]
            ) {
                throw new Error(
                    'The definition for "{0}" is an alias of the service "{1}" and cannot define another parameter.'.format(
                        service.id,
                        service.alias
                    )
                );
            }
        }
    }

    this._servicesContainer.setAlias(service.id, service.alias);

    return service;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Alias.prototype.merge = function(parent, child) {
    if (null == child.class) {
        child.class = parent.class;
    }

    return child;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Alias.prototype.instantiate = function(instance, definition) {
    return instance;
}
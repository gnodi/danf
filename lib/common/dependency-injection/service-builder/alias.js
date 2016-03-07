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
Alias.prototype.define = function(definition) {
    if (definition.alias) {
        for (var parameter in definition) {
            if (!(parameter in {'alias': true, 'id': true, 'lock': true, 'namespace': true})
                && undefined !== definition[parameter]
            ) {
                throw new Error(
                    'The definition for "{0}" is an alias of the service "{1}" and cannot define another parameter.'.format(
                        definition.id,
                        definition.alias
                    )
                );
            }
        }
    }

    this._servicesContainer.setAlias(definition.id, definition.alias);

    return definition;
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
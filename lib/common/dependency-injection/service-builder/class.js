'use strict';

/**
 * Expose `Class`.
 */
module.exports = Class;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    AbstractServiceBuilder = require('./abstract-service-builder')
;

/**
 * Initialize a new class service builder.
 */
function Class() {
    AbstractServiceBuilder.call(this);

    this._instantiateOrder = 1000;
}

utils.extend(AbstractServiceBuilder, Class);

Class.defineDependency('_classesContainer', 'danf:object.classesContainer');

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Object.defineProperty(Class.prototype, 'contract', {
    value: {
        class: {
            type: 'string|function',
            namespace: ['string']
        }
    }
});

/**
 * Set the classes container.
 *
 * @param {danf:object.classesContainer} The classes container.
 * @api public
 */
Object.defineProperty(Class.prototype, 'classesContainer', {
    set: function(classesContainer) { this._classesContainer = classesContainer; }
});

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Class.prototype.merge = function(parent, child) {
    if (null == child.class) {
        child.class = parent.class;
    }

    return child;
}

/**
 * @interface {danf:dependencyInjection.serviceBuilder}
 */
Class.prototype.instantiate = function(instance, definition) {
    if (!definition.class) {
        throw new Error(
            'The service "{0}" should define the class parameter.'.format(
                definition.id
            )
        );
    }

    if ('string' === typeof definition.class) {
        definition.class = this._classesContainer.get(definition.class);
    }

    // Do not allow instantiation of abstract classes.
    if (definition.class.__metadata.abstract) {
        throw new Error(
            'The service "{0}" could not be instantiated because its class "{1}" is an abstract class.'.format(
                definition.id,
                definition.class.__metadata.id
            )
        );
    }

    if (null == instance) {
        instance = new definition.class();
    }

    if (undefined === instance.__metadata) {
        Object.defineProperty(instance, '__metadata', {
            get: function() { return this.__metadata__; },
            set: function(metadata) { this.__metadata__ = metadata; },
            enumerable: false
        });

        instance.__metadata = {
            id: definition.id,
            class: definition.class.__metadata.id,
            module: definition.class.__metadata.module,
            implements: definition.class.__metadata.implements || [],
            dependencies: definition.class.__metadata.dependencies || {}
        };
    }

    return instance;
}
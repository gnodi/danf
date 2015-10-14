'use strict';

/**
 * Expose `Registry`.
 */
module.exports = Registry;

/**
 * Module dependencies.
 */
var utils = require('../utils'),
    BaseRegistry = require('../manipulation/registry')
;

/**
 * Initialize a new registry.
 */
function Registry() {
    BaseRegistry.call(this);
}

utils.extend(BaseRegistry, Registry);

Registry.defineImplementedInterfaces(['danf:dependencyInjection.provider']);

Registry.defineDependency('_interface', 'string|null');
Registry.defineDependency('_interfacer', 'danf:object.interfacer');

/**
 * Interface of instances (optional).
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Registry.prototype, 'interface', {
    set: function(interface_) {
        this._interface = interface_;

        if (this._interface) {
            for (var name in this._items) {
                checkInterface(this._items[name], this._interface);
            }
        }
    }
});

/**
 * @interface {danf:dependencyInjection.provider}
 */
Object.defineProperty(Registry.prototype, 'providedType', {
    get: function() { return this._interface; }
});

/**
 * Interfacer.
 *
 * @var {danf:object.interfacer}
 * @api public
 */
Object.defineProperty(Registry.prototype, 'interfacer', {
    set: function(interfacer) { this._interfacer = interfacer; }
});

/**
 * @interface {danf:manipulation.registry}
 */
Registry.prototype.register = function(name, item) {
    checkInterface(item, this._interface);

    this._items[name] = item;
}

/**
 * @interface {danf:dependencyInjection.provider}
 */
Registry.prototype.provide = function() {
    var args = Array.prototype.slice.call(arguments, 1, 2);

    return this.get(args[0]);
}

/**
 * Check if the class implements the interface.
 *
 * @param {function} class_ The class.
 * @param {string} interface_ The interface.
 * @throw {error} If the class does not implement the interface.
 * @api private
 */
var checkInterface = function(class_, interface_) {
    try {
        if (interface_) {
            Object.checkType(item, interface_);
        }
    } catch (error) {
        if (error.instead) {
            throw new Error('The registered object should be {0}; {1} given instead.'.format(
                error.expected,
                error.instead
            ));
        }

        throw error;
    }
}
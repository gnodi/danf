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
 * Init.
 */
Registry.prototype.__init = function() {
    if (this._interface) {
        for (var name in this._items) {
            checkInterface.call(this, this._items[name], this._interface);
        }
    }
}

/**
 * Interface of instances (optional).
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Registry.prototype, 'interface', {
    set: function(interface_) {
        this._interface = interface_;
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
    checkInterface.call(this, item, this._interface);

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
var checkInterface = function(item, interface_) {
    try {
        if (interface_) {
            Object.checkType(item, interface_);
        }
    } catch (error) {
        if (error.instead) {
            error.message = 'The registry{0} allows to register {1}; {2} given instead.'.format(
                this._name ? ' for "{0}"'.format(this._name) : '',
                error.expected,
                error.instead
            );
        }

        throw error;
    }
}
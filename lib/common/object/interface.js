'use strict';

/**
 * Expose `Interface`.
 */
module.exports = Interface;

/**
 * Module dependencies.
 */
var utils = require('../utils');

/**
 * Initialize a new interface.
 */
function Interface() {
    this._methods = {};
    this._getters = {};
    this._setters = {};
}

Interface.defineImplementedInterfaces(['danf:object.interface']);

Interface.defineDependency('_name', 'string');
Interface.defineDependency('_extends', 'string|null');
Interface.defineDependency('_methods', 'mixed_object_object');
Interface.defineDependency('_getters', 'string_object');
Interface.defineDependency('_setters', 'string_object');

/**
 * Name.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Interface.prototype, 'name', {
    set: function(name) { this._name = name; },
    get: function() { return this._name; }
});

/**
 * Name of the extended interface.
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(Interface.prototype, 'extends', {
    set: function(extends_) { this._extends = extends_; },
    get: function() { return this._extends; }
});

/**
 * Methods.
 *
 * @var {mixed_object_object}
 * @api public
 */
Object.defineProperty(Interface.prototype, 'methods', {
    set: function(methods) { this._methods = methods; },
    get: function() { return this._methods; }
});

/**
 * Getters.
 *
 * @var {string_object}
 * @api public
 */
Object.defineProperty(Interface.prototype, 'getters', {
    set: function(getters) { this._getters = getters; },
    get: function() { return this._getters; }
});

/**
 * Setters.
 *
 * @var {string_object}
 * @api public
 */
Object.defineProperty(Interface.prototype, 'setters', {
    set: function(setters) { this._setters = setters; },
    get: function() { return this._setters; }
});

/**
 * @interface {danf:object.interface}
 */
Interface.prototype.hasMethod = function (name) {
    return this.methods.hasOwnProperty(name);
}

/**
 * @interface {danf:object.interface}
 */
Interface.prototype.getMethod = function (name) {
    if (!this.hasMethod(name)) {
        throw new Error(
            'The method "{0}" of the interface "{1}" is not defined.'.format(
                this._name,
                name
            )
        );
    }

    return this._methods[name];
}

/**
 * @interface {danf:object.interface}
 */
Interface.prototype.hasGetter = function (name) {
    return this._getters.hasOwnProperty(name);
}

/**
 * @interface {danf:object.interface}
 */
Interface.prototype.getGetter = function (name) {
    if (!this.hasGetter(name)) {
        throw new Error(
            'The getter "{0}" of the interface "{1}" is not defined.'.format(
                this._name,
                name
            )
        );
    }

    return this._getters[name];
}

/**
 * @interface {danf:object.interface}
 */
Interface.prototype.hasSetter = function (name) {
    return this._setters.hasOwnProperty(name);
}

/**
 * @interface {danf:object.interface}
 */
Interface.prototype.getSetter = function (name) {
    if (!this.hasSetter(name)) {
        throw new Error(
            'The setter "{0}" of the interface "{1}" is not defined.'.format(
                this._name,
                name
            )
        );
    }

    return this._setters[name];
}
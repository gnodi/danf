'use strict';

/**
 * Expose `ObjectProvider`.
 */
module.exports = ObjectProvider;

/**
 * Module dependencies.
 */
var utils = require('../utils');

/**
 * Initialize a new object provider.
 */
function ObjectProvider() {
    this.properties = {};
    this.debug = true;
}

ObjectProvider.defineImplementedInterfaces(['danf:dependencyInjection.provider']);

ObjectProvider.defineDependency('_class', 'function');
ObjectProvider.defineDependency('_interface', 'string|null');
ObjectProvider.defineDependency('_properties', 'mixed_object');
ObjectProvider.defineDependency('_debug', 'boolean');
ObjectProvider.defineDependency('_interfacer', 'danf:object.interfacer');
ObjectProvider.defineDependency('_classesContainer', 'danf:object.classesContainer');

/**
 * Init.
 */
ObjectProvider.prototype.__init = function() {
    if ('string' === typeof this._class && this._classesContainer) {
        this._class = this._classesContainer.get(this._class);
    }
    if ('function' === typeof this._class && this._interface) {
        checkInterface(this._class, this._interface);
    }
}

/**
 * Interface the class should implement (optional).
 *
 * @var {string}
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'interface', {
    set: function(interface_) {
        this._interface = interface_;

        this.__init();
    }
});

/**
 * Class of provided instances.
 *
 * @var {danf:object.interfacer}
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'class', {
    set: function(class_) {
        this._class = class_;

        this.__init();
    }
});

/**
 * Properties.
 *
 * @var {mixed_object}
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'properties', {
    set: function(properties) { this._properties = properties; }
});

/**
 * Whether or not the debug mode is active.
 *
 * @var {boolean}
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'debug', {
    set: function(debug) { this._debug = debug; }
});

/**
 * @interface {danf:dependencyInjection.provider}
 */
Object.defineProperty(ObjectProvider.prototype, 'providedType', {
    get: function() { return this._interface || 'object'; }
});

/**
 * Interfacer.
 *
 * @var {danf:object.interfacer}
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'interfacer', {
    set: function(interfacer) { this._interfacer = interfacer; }
});

/**
 * Classes container.
 *
 * @var {danf:object.classesContainer}
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'classesContainer', {
    set: function(classesContainer) {
        this._classesContainer = classesContainer;

        this.__init();
    }
});

/**
 * @interface {danf:dependencyInjection.provider}
 */
ObjectProvider.prototype.provide = function(properties) {
    var object = new this._class(),
        properties = utils.merge(this._properties, properties || {})
    ;

    for (var name in properties) {
        object[name] = properties[name];
    }

    // Check that all dependencies have been passed.
    if (this._debug) {
        Object.checkDependencies(object);
    }

    // Call __init method.
    if ('function' === typeof object.__init) {
        object.__init();
    }

    return (this._debug && this._interface)
        ? this._interfacer.addProxy(object, this._interface)
        : object
    ;
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
        var object = Object.create(class_);

        Object.checkType(object, interface_);
    } catch (error) {
        if (error.instead) {
            error.message = 'The provided object should be {0}; {1} given instead.'.format(
                error.expected,
                error.instead
            );
        }

        throw error;
    }
}
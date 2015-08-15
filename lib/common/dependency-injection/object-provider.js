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
 *
 * @param {string} class_ The class of the provided object.
 * @param {danf:object.interfacer} interfacer The interfacer.
 * @param {string} interface_ The interface the context should implement (optional).
 * @param {danf:object.classesRegistry} The classes registry.
 * @param {mixed_object} properties The properties.
 * @param {boolean} debug Whether or not the debug mode is active.
 * @api public
 */
function ObjectProvider(class_, interfacer, interface_, classesRegistry, properties, debug) {
    if (class_) {
        this.class = class_;
    }
    if (interface_) {
        this.interface = interface_;
    }
    this.properties = properties || {};
    this.debug = debug || true;
    if (interfacer) {
        this.interfacer = interfacer;
    }
    if (classesRegistry) {
        this.classesRegistry = classesRegistry;
    }
}

ObjectProvider.defineImplementedInterfaces(['danf:dependencyInjection.provider']);

ObjectProvider.defineDependency('_class', 'function');
ObjectProvider.defineDependency('_interface', 'string|null');
ObjectProvider.defineDependency('_properties', 'mixed_object');
ObjectProvider.defineDependency('_debug', 'boolean');
ObjectProvider.defineDependency('_interfacer', 'danf:object.interfacer');
ObjectProvider.defineDependency('_classesRegistry', 'danf:object.classesRegistry');

/**
 * Init.
 */
ObjectProvider.prototype.__init = function() {
    if (this._interface) {
        checkInterface(this._class, this._interface);
    }
    this._class = this._classesRegistry.get(this._class);
}

/**
 * Set the interface the context should implement (optional).
 *
 * @param {string}
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'interface', {
    set: function(interface_) { this._interface = interface_; }
});

/**
 * Set the class.
 *
 * @param {danf:object.interfacer} The class.
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'class', {
    set: function(class_) { this._class = class_; }
});

/**
 * Set the properties.
 *
 * @param {mixed_object} The properties.
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'properties', {
    set: function(properties) { this._properties = properties; }
});

/**
 * Set whether or not the debug mode is active.
 *
 * @param {boolean} The debug flag.
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
 * Set the interfacer.
 *
 * @param {danf:object.interfacer} The interfacer.
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'interfacer', {
    set: function(interfacer) { this._interfacer = interfacer; }
});

/**
 * Set the classes registry.
 *
 * @param {danf:object.classesRegistry} The classes registry.
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'classesRegistry', {
    set: function(classesRegistry) {
        this._classesRegistry = classesRegistry;
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
            throw new Error('The provided object should be {0}; {1} given instead.'.format(
                error.expected,
                error.instead
            ));
        }

        throw error;
    }
}
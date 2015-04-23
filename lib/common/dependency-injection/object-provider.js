'use strict';

/**
 * Expose `ObjectProvider`.
 */
module.exports = ObjectProvider;

/**
 * Initialize a new object provider.
 *
 * @param {string} class_ The class of the provided object.
 * @param {danf:object.interfacer} interfacer The interfacer.
 * @param {string} interface_ The interface the context should implement (optional).
 * @param {danf:object.classesRegistry} The classes registry.
 * @api public
 */
function ObjectProvider(class_, interfacer, interface_, classesRegistry) {
    if (class_) {
        this.class = class_;
    }
    this.interface = interface_ || 'object';
    if (interfacer) {
        this.interfacer = interfacer;
    }
    if (classesRegistry) {
        this.classesRegistry = classesRegistry;
    }
}

ObjectProvider.defineImplementedInterfaces(['danf:dependencyInjection.objectProvider', 'danf:dependencyInjection.provider']);

ObjectProvider.defineDependency('_class', 'function');
ObjectProvider.defineDependency('_interface', 'string');
ObjectProvider.defineDependency('_interfacer', 'danf:object.interfacer');
ObjectProvider.defineDependency('_classesRegistry', 'danf:object.classesRegistry');

/**
 * Set the interface the context should implement (optional).
 *
 * @param {string}
 * @api public
 */
Object.defineProperty(ObjectProvider.prototype, 'interface', {
    set: function(interface_) {
        Object.checkType(interface_, 'string');

        if (this._class && 'function' === typeof this._class) {
            checkInterface(this._class, interface_);
        }

        this._interface = interface_;
    }
});

/**
 * @interface {danf:dependencyInjection.objectProvider}
 */
Object.defineProperty(ObjectProvider.prototype, 'class', {
    set: function(class_) {
        if (this._classesRegistry) {
            if ('string' === typeof class_) {
                class_ = this._classesRegistry.get(class_);
            }

            Object.checkType(class_, 'function');

            if (this._interface && 'object' !== this._interface) {
                checkInterface(class_, this._interface);
            }
        }

        this._class = class_;
    }
});

/**
 * @interface {danf:dependencyInjection.provider}
 */
Object.defineProperty(ObjectProvider.prototype, 'providedType', {
    get: function() { return this._interface; }
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

        if (this._class) {
            this.class = this._class;
        }
    }
});

/**
 * @interface {danf:dependencyInjection.provider}
 */
ObjectProvider.prototype.provide = function() {
    var self = this,
        Constructor = function(args) {
            return self._class.apply(this, args);
        }
    ;

    Constructor.prototype = self._class.prototype;

    var object = new Constructor(arguments)

    return Object.isInterfaceType(this._interface)
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
        Object.checkType(new class_(), interface_);
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
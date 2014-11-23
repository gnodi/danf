'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new object provider.
     *
     * @param {string} class_ The class of the provided object.
     * @param {danf:object.interfacer} interfacer The interfacer.
     * @param {string} interface_ The interface the context should implement (optional).
     * @api public
     */
    function ObjectProvider(class_, interfacer, interface_) {
        if (class_) {
            this.class = class_;
        }
        this.interface = interface_ || 'object';
        if (interfacer) {
            this.interfacer = interfacer;
        }
    }

    ObjectProvider.defineImplementedInterfaces(['danf:dependencyInjection.objectProvider', 'danf:dependencyInjection.provider']);

    ObjectProvider.defineDependency('_class', 'function');
    ObjectProvider.defineDependency('_interface', 'string');
    ObjectProvider.defineDependency('_interfacer', 'danf:object.interfacer');

    /**
     * Set the interface the context should implement (optional).
     *
     * @param {string}
     * @api public
     */
    Object.defineProperty(ObjectProvider.prototype, 'interface', {
        set: function(interface_) {
            Object.checkType(interface_, 'string');

            if (this._class) {
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
            Object.checkType(class_, 'function');

            if (this._interface && 'object' !== this._interface) {
                checkInterface(class_, this._interface);
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

    /**
     * Expose `ObjectProvider`.
     */
    return ObjectProvider;
});
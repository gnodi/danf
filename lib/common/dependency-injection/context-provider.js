'use strict';

/**
 * Expose `ContextProvider`.
 */
module.exports = ContextProvider;

/**
 * Initialize a new context provider.
 *
 * @param {danf:object.interfacer} interfacer The interfacer.
 * @param {string} interface_ The interface the context should implement (optional).
 * @api public
 */
function ContextProvider(interfacer, interface_) {
    this.interface = interface_ || 'mixed';
    if (interfacer) {
        this.interfacer = interfacer;
    }
}

ContextProvider.defineImplementedInterfaces(['danf:dependencyInjection.contextProvider', 'danf:dependencyInjection.provider']);

ContextProvider.defineDependency('_interface', 'string');
ContextProvider.defineDependency('_interfacer', 'danf:object.interfacer');

/**
 * Set the interface the context should implement (optional).
 *
 * @param {string}
 * @api public
 */
Object.defineProperty(ContextProvider.prototype, 'interface', {
    set: function(interface_) {
        Object.checkType(interface_, 'string');

        this._interface = interface_;
    }
});

/**
 * @interface {danf:dependencyInjection.provider}
 */
Object.defineProperty(ContextProvider.prototype, 'providedType', {
    get: function() { return this._interface; }
});

/**
 * Set the interfacer.
 *
 * @param {danf:object.interfacer} The interfacer.
 * @api public
 */
Object.defineProperty(ContextProvider.prototype, 'interfacer', {
    set: function(interfacer) { this._interfacer = interfacer; }
});

/**
 * @interface {danf:dependencyInjection.contextProvider}
 */
ContextProvider.prototype.set = function(context) {
    if (this._interface) {
        try {
            Object.checkType(context, this._interface);
        } catch (error) {
            if (error.instead && 'object' !== this._interface) {
                throw new Error('The context object should be {0}; {1} given instead.'.format(
                    error.expected,
                    error.instead
                ));
            }

            throw error;
        }
    }

    this._context = Object.isInterfaceType(this._interface) && !context.isProxy
        ? this._interfacer.addProxy(context, this._interface)
        : context
    ;
}

/**
 * @interface {danf:dependencyInjection.contextProvider}
 */
ContextProvider.prototype.unset = function() {
    delete this._context;
}

/**
 * @interface {danf:dependencyInjection.provider}
 */
ContextProvider.prototype.provide = function() {
    if (undefined === this._context) {
        throw new Error('The context is empty.');
    }

    return this._context;
}
'use strict';

define(function(require) {
    /**
     * Initialize a new MyClass.
     */
    function MyClass() {
        this._myProperty;
    }

    MyClass.defineImplementedInterfaces(['myInterface']);

    MyClass.defineDependency('_myProperty', 'string');

    /**
     * My property.
     *
     * @param {string}
     * @api public
     */
    Object.defineProperty(MyClass.prototype, 'myProperty', {
        get: function() { return this._myProperty; },
        set: function(myProperty) { this._myProperty = myProperty; }
    });

    /**
     * @interface {myInterface}
     */
    MyClass.prototype.myMethod = function(arg0, arg1) {
        return arg0 + arg1;
    }

    /**
     * Expose `MyClass`.
     */
    return MyClass;
});
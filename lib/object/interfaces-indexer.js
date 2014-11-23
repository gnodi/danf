'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('danf/utils') : require('../utils');

    /**
     * Initialize a new interfaces indexer.
     */
    function InterfacesIndexer() {
        this._interfaces = {};
    }

    InterfacesIndexer.defineImplementedInterfaces(['danf:object.interfacesIndexer']);

    /**
     * Process a configuration.
     *
     * @param {object} config The config.
     * @api public
     */
    InterfacesIndexer.prototype.processConfiguration = function (config) {
        for (var name in config) {
            this.index(name, config[name]);
        }

        for (var name in this._interfaces) {
            var interface_ = this._interfaces[name];

            interface_ = extendInterface.call(this, interface_);
        }
    }

    /**
     * @interface {danf:object.interfacesIndexer}
     */
    InterfacesIndexer.prototype.index = function(name, interface_) {
        this._interfaces[name] = interface_;
    }

    /**
     * @interface {danf:object.interfacesIndexer}
     */
    InterfacesIndexer.prototype.has = function (name) {
        return this._interfaces[name] ? true : false;
    }

    /**
     * @interface {danf:object.interfacesIndexer}
     */
    InterfacesIndexer.prototype.get = function(name) {
        if (this.has(name)) {
            return this._interfaces[name];
        }

        throw new Error(
            'The interface "{0}" is not defined.'.format(name)
        );
    }

    /**
     * @interface {danf:object.interfacesIndexer}
     */
    InterfacesIndexer.prototype.getAll = function() {
        return this._interfaces;
    }

    /**
     * @interface {danf:object.interfacesIndexer}
     */
    InterfacesIndexer.prototype.hasMethod = function (name, methodName) {
        var interface_ = this.get(name);

        return interface_.methods && interface_.methods.hasOwnProperty(methodName) ? true : false;
    }

    /**
     * @interface {danf:object.interfacesIndexer}
     */
    InterfacesIndexer.prototype.getMethod = function (name, methodName) {
        if (this.hasMethod(name, methodName)) {
            var interface_ = this.get(name);

            return interface_.methods[methodName];
        }

        this.get(name);

        throw new Error(
            'The method "{0}" of the interface "{1}" is not defined.'.format(
                name,
                methodName
            )
        );
    }

    /**
     * @interface {danf:object.interfacesIndexer}
     */
    InterfacesIndexer.prototype.hasGetter = function (name, getterName) {
        var interface_ = this.get(name);

        return interface_.getters && interface_.getters.hasOwnProperty(getterName) ? true : false;
    }

    /**
     * @interface {danf:object.interfacesIndexer}
     */
    InterfacesIndexer.prototype.getGetter = function (name, getterName) {
        if (this.hasGetter(name, getterName)) {
            var interface_ = this.get(name);

            return interface_.getters[getterName];
        }

        this.get(name);

        throw new Error(
            'The getter "{0}" of the interface "{1}" is not defined.'.format(
                name,
                getterName
            )
        );
    }

    /**
     * @interface {danf:object.interfacesIndexer}
     */
    InterfacesIndexer.prototype.hasSetter = function (name, setterName) {
        var interface_ = this.get(name);

        return interface_.setters && interface_.setters.hasOwnProperty(setterName) ? true : false;
    }

    /**
     * @interface {danf:object.interfacesIndexer}
     */
    InterfacesIndexer.prototype.getSetter = function (name, setterName) {
        if (this.hasSetter(name, setterName)) {
            var interface_ = this.get(name);

            return interface_.setters[setterName];
        }

        this.get(name);

        throw new Error(
            'The setter "{0}" of the interface "{1}" is not defined.'.format(
                name,
                setterName
            )
        );
    }

    /**
     * Extend an interface.
     *
     * @param {object} interface_ The interface.
     * @return {object} The extended interface.
     * @api private
     */
    var extendInterface = function(interface_) {
        if (interface_.extends) {
            var extendedInterface = extendInterface.call(this, this.get(interface_.extends));

            interface_.methods = utils.merge(extendedInterface.methods, interface_.methods);
            interface_.getters = utils.merge(extendedInterface.getters, interface_.getters);
            interface_.setters = utils.merge(extendedInterface.setters, interface_.setters);
        }

        return interface_;
    }

    /**
     * Expose `InterfacesIndexer`.
     */
    return InterfacesIndexer;
});
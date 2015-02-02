'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('danf/utils') : require('../utils'),
        Registry = module.isClient ? require('danf/manipulation/registry') : require('./registry')
    ;

    /**
     * Initialize a new NotifierRegistry.
     */
    function NotifierRegistry() {
        Registry.call(this);

        this._observers = [];
        this._notify = true;
    }

    utils.extend(Registry, NotifierRegistry);

    NotifierRegistry.defineImplementedInterfaces(['danf:manipulation.notifierRegistry']);

    NotifierRegistry.defineDependency('_observers', 'danf:manipulation.registryObserver_array');

    /**
     * Set the observers.
     *
     * @param {danf:manipulation.registryObserver_array}
     * @api public
     */
    Object.defineProperty(NotifierRegistry.prototype, 'observers', {
        set: function(observers) {
            for (var i = 0; i < observers.length; i++) {
                this.addObserver(observers[i]);
            }
        }
    });

    /**
     * @interface {danf:manipulation.notifierRegistry}
     */
    NotifierRegistry.prototype.addObserver = function(observer) {
        for (var i = 0; i < this._observers.length; i++) {
            // Check if the observer is already observing.
            if (observer === this._observers[i]) {
                return;
            }
        }

        this._observers.push(observer);
    }

    /**
     * @interface {danf:manipulation.notifierRegistry}
     */
    NotifierRegistry.prototype.removeObserver = function(observer) {
        for (var i = 0; i < this._observers.length; i++) {
            if (observer === this._observers[i]) {
                this._observers.splice(i, 1);

                return;
            }
        }
    }

    /**
     * @interface {danf:manipulation.notifierRegistry}
     */
    NotifierRegistry.prototype.removeAllObservers = function() {
        this._observers = [];
    }

    /**
     * @interface {danf:manipulation.registry}
     */
    NotifierRegistry.prototype.register = function(name, item) {
        this._items[name] = item;

        if (this._notify) {
            var items = {};

            items[name] = item;
            notify.call(this, items, false);
        }
    }

    /**
     * @interface {danf:manipulation.registry}
     */
    NotifierRegistry.prototype.registerSet = function(items) {
        this._notify = false;

        for (var name in items) {
            this.register(name, items[name]);
        }

        notify.call(this, items, false);

        this._notify = true;
    }

    /**
     * @interface {danf:manipulation.registry}
     */
    NotifierRegistry.prototype.deregister = function(name) {
        var item = this._items[name];

        if (item) {
            delete this._items[name];

            if (this._notify) {
                var items = {};

                items[name] = item;
                notify.call(this, items, true);
            }
        }
    }

    /**
     * @interface {danf:manipulation.registry}
     */
    NotifierRegistry.prototype.deregisterAll = function() {
        this._notify = false;

        var items = this._items;

        for (var name in items) {
            this.deregister(name);
        }

        notify.call(this, items, true);

        this._notify = true;
    }

    /**
     * Notify the observers.
     *
     * @param {danf:manipulation.registryObserver_array}
     * @api public
     */
    var notify = function(items, reset) {
        for (var i = 0; i < this._observers.length; i++) {
            this._observers[i].handleRegistryChange(items, reset, this._name);
        }
    }

    /**
     * Expose `NotifierRegistry`.
     */
    return NotifierRegistry;
});
'use strict';

/**
 * Expose `Registry`.
 */
module.exports = Registry;

/**
 * Initialize a new registry.
 */
function Registry() {
    this._items = {};
    this._name = '';
}

Registry.defineImplementedInterfaces(['danf:manipulation.registry']);

Registry.defineDependency('_name', 'string');

/**
 * @interface {danf:manipulation.registry}
 */
Object.defineProperty(Registry.prototype, 'name', {
    get: function() { return this._name; },
    set: function(name) { this._name = name; }
});

/**
 * @interface {danf:manipulation.registry}
 */
Registry.prototype.register = function(name, item) {
    this._items[name] = item;
}

/**
 * @interface {danf:manipulation.registry}
 */
Registry.prototype.registerSet = function(items) {
    for (var name in items) {
        this.register(name, items[name]);
    }
}

/**
 * @interface {danf:manipulation.registry}
 */
Registry.prototype.deregister = function(name) {
    if (this._items[name]) {
        delete this._items[name];
    }
}

/**
 * @interface {danf:manipulation.registry}
 */
Registry.prototype.deregisterAll = function() {
    for (var name in this._items) {
        this.deregister(name);
    }
}

/**
 * @interface {danf:manipulation.registry}
 */
Registry.prototype.has = function(name) {
    return this._items[name] ? true : false;
}

/**
 * @interface {danf:manipulation.registry}
 */
Registry.prototype.get = function(name) {
    if (this.has(name)) {
        return this._items[name];
    }

    throw new Error(
        'The item "{0}" has not been registered {1}.'.format(
            name,
            this._name ? 'in the list of "{0}"'.format(this._name) : ''
        )
    );
}

/**
 * @interface {danf:manipulation.registry}
 */
Registry.prototype.getAll = function() {
    return this._items;
}
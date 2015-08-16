'use strict';

/**
 * Expose `Map`.
 */
module.exports = Map;

/**
 * Initialize a new map.
 */
function Map() {
    this._items = {};
    this._name = '';
}

Map.defineImplementedInterfaces(['danf:manipulation.map']);

Map.defineDependency('_name', 'string|null');

/**
 * @interface {danf:manipulation.map}
 */
Object.defineProperty(Map.prototype, 'name', {
    get: function() { return this._name; },
    set: function(name) { this._name = name; }
});

/**
 * @interface {danf:manipulation.map}
 */
Map.prototype.set = function(name, item) {
    this._items[name] = item;
}

/**
 * @interface {danf:manipulation.map}
 */
Map.prototype.unset = function(name) {
    if (this._items[name]) {
        delete this._items[name];
    }
}

/**
 * @interface {danf:manipulation.map}
 */
Map.prototype.clear = function() {
    for (var name in this._items) {
        this.unset(name);
    }
}

/**
 * @interface {danf:manipulation.map}
 */
Map.prototype.has = function(name) {
    return this._items[name] ? true : false;
}

/**
 * @interface {danf:manipulation.map}
 */
Map.prototype.get = function(name) {
    if (!this.has(name)) {
        throw new Error(
            'The item "{0}" has not been set {1}.'.format(
                name,
                this._name ? 'in context "{0}"'.format(this._name) : ''
            )
        );
    }

    return this._items[name];
}

/**
 * @interface {danf:manipulation.map}
 */
Map.prototype.getAll = function() {
    return this._items;
}
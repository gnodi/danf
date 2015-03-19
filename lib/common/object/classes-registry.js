'use strict';

/**
 * Expose `ClassesRegistry`.
 */
module.exports = ClassesRegistry;

/**
 * Initialize a new classes registry.
 */
function ClassesRegistry() {
    this._classes = {};
}

ClassesRegistry.defineImplementedInterfaces(['danf:object.classesRegistry', 'danf:manipulation.registryObserver']);

/**
 * @interface {danf:manipulation.registryObserver}
 */
ClassesRegistry.prototype.handleRegistryChange = function(items, reset, name) {
    for (var name in items) {
        this.index(name, items[name]);
    }
}

/**
 * @interface {danf:object.classesRegistry}
 */
ClassesRegistry.prototype.index = function(name, class_) {
    class_.__metadata.id = name;

    this._classes[name] = class_;
}

/**
 * @interface {danf:object.classesRegistry}
 */
ClassesRegistry.prototype.has = function(name) {
    return this._classes[name] ? true : false;
}

/**
 * @interface {danf:object.classesRegistry}
 */
ClassesRegistry.prototype.get = function(name) {
    if (this.has(name)) {
        return this._classes[name];
    }

    throw new Error(
        'The class "{0}" is not defined.'.format(name)
    );
}

/**
 * @interface {danf:object.classesRegistry}
 */
ClassesRegistry.prototype.getAll = function() {
    return this._classes;
}
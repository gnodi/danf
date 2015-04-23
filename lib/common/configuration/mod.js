'use strict';

/**
 * Expose `Module`.
 */
module.exports = Module;

/**
 * Initialize a new module.
 */
function Module() {
    this._id = '';
    this._alias;
    this._level = [];
    this._contract = {};
    this._config = {};
    this._dependencies = {};
}

Module.defineImplementedInterfaces(['danf:configuration.module']);

/**
 * @interface {danf:configuration.module}
 */
Object.defineProperty(Module.prototype, 'id', {
    get: function() { return this._id; },
    set: function(id) { this._id = id; }
});

/**
 * @interface {danf:configuration.module}
 */
Object.defineProperty(Module.prototype, 'alias', {
    get: function() { return this._alias; },
    set: function(alias) { this._alias = alias; }
});

/**
 * @interface {danf:configuration.module}
 */
Object.defineProperty(Module.prototype, 'level', {
    get: function() { return this._level; },
    set: function(level) { this._level = level; }
});

/**
 * @interface {danf:configuration.module}
 */
Object.defineProperty(Module.prototype, 'contract', {
    get: function() { return this._contract; },
    set: function(contract) {
        if (!contract) {
            contract = {};
        }

        this._contract = contract; }
});

/**
 * @interface {danf:configuration.module}
 */
Object.defineProperty(Module.prototype, 'config', {
    get: function() { return this._config; },
    set: function(config) {
        if (!config) {
            config = {};
        }

        this._config = config;
    }
});

/**
 * @interface {danf:configuration.module}
 */
Object.defineProperty(Module.prototype, 'parent', {
    get: function() { return this._parent; },
    set: function(parent) { this._parent = parent; }
});

/**
 * @interface {danf:configuration.module}
 */
Object.defineProperty(Module.prototype, 'dependencies', {
    get: function() { return this._dependencies; },
    set: function(dependencies) { this._dependencies = dependencies; }
});

/**
 * @interface {danf:configuration.module}
 */
Module.prototype.setDependency = function(alias, dependency) {
    if (!(dependency instanceof Module) && 'string' !== typeof dependency) {
        throw new Error('A dependency must be a "Module" or an alias of another module.');
    }

    this._dependencies[alias] = dependency;
}
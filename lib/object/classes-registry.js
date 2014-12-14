'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new classes registry.
     */
    function ClassesRegistry() {
        this._classes = {};
    }

    ClassesRegistry.defineImplementedInterfaces(['danf:object.classesRegistry']);

    /**
     * Process a configuration.
     *
     * @param {object} config The config.
     * @api public
     */
    ClassesRegistry.prototype.processConfiguration = function (config) {
        for (var name in config) {
            this.index(name, config[name]);
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

    /**
     * Expose `ClassesRegistry`.
     */
    return ClassesRegistry;
});
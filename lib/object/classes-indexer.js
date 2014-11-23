'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new classes indexer.
     */
    function ClassesIndexer() {
        this._classes = {};
    }

    ClassesIndexer.defineImplementedInterfaces(['danf:object.classesIndexer']);

    /**
     * Process a configuration.
     *
     * @param {object} config The config.
     * @api public
     */
    ClassesIndexer.prototype.processConfiguration = function (config) {
        for (var name in config) {
            this.index(name, config[name]);
        }
    }

    /**
     * @interface {danf:object.classesIndexer}
     */
    ClassesIndexer.prototype.index = function(name, class_) {
        class_.__metadata.id = name;

        this._classes[name] = class_;
    }

    /**
     * @interface {danf:object.classesIndexer}
     */
    ClassesIndexer.prototype.has = function(name) {
        return this._classes[name] ? true : false;
    }

    /**
     * @interface {danf:object.classesIndexer}
     */
    ClassesIndexer.prototype.get = function(name) {
        if (this.has(name)) {
            return this._classes[name];
        }

        throw new Error(
            'The class "{0}" is not defined.'.format(name)
        );
    }

    /**
     * @interface {danf:object.classesIndexer}
     */
    ClassesIndexer.prototype.getAll = function() {
        return this._classes;
    }

    /**
     * Expose `ClassesIndexer`.
     */
    return ClassesIndexer;
});
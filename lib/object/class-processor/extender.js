'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('danf/utils') : require('../../utils');

    /**
     * Initialize a new extender class processor.
     *
     * @param {danf:object.classesIndexer} classesIndexer The classes indexer.
     */
    function Extender(classesIndexer) {
        if (classesIndexer) {
            this.classesIndexer = classesIndexer;
        }
    }

    Extender.defineImplementedInterfaces(['danf:object.classProcessor']);

    Extender.defineDependency('_classesIndexer', 'danf:object.classesIndexer');

    /**
     * Set the classes indexer.
     *
     * @param {danf:object.classesIndexer} classesIndexer The classes indexer.
     * @api public
     */
    Object.defineProperty(Extender.prototype, 'classesIndexer', {
        set: function(classesIndexer) { this._classesIndexer = classesIndexer; }
    });

    /**
     * @interface {danf:object.classProcessor}
     */
    Object.defineProperty(Extender.prototype, 'order', {
        value: 1000
    });

    /**
     * @interface {danf:object.classProcessor}
     */
    Extender.prototype.process = function (class_) {
        var extendedClassName = class_.__metadata.extends;

        if (extendedClassName && !class_.Parent) {
            var parent = this._classesIndexer.get(extendedClassName);

            this.process(parent);

            class_.Parent = parent;
            utils.extend(parent, class_);
        }
    }

    /**
     * Expose `Extender`.
     */
    return Extender;
});
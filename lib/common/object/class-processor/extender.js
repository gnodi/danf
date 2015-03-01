'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Module dependencies.
     */
    var utils = module.isClient ? require('danf/utils') : require('../../../utils');

    /**
     * Initialize a new extender class processor.
     *
     * @param {danf:object.classesRegistry} classesRegistry The classes registry.
     */
    function Extender(classesRegistry) {
        if (classesRegistry) {
            this.classesRegistry = classesRegistry;
        }
    }

    Extender.defineImplementedInterfaces(['danf:object.classProcessor']);

    Extender.defineDependency('_classesRegistry', 'danf:object.classesRegistry');

    /**
     * Set the classes registry.
     *
     * @param {danf:object.classesRegistry} classesRegistry The classes registry.
     * @api public
     */
    Object.defineProperty(Extender.prototype, 'classesRegistry', {
        set: function(classesRegistry) { this._classesRegistry = classesRegistry; }
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
            var parent = this._classesRegistry.get(extendedClassName);

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
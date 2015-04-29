'use strict';

/**
 * Expose `Extender`.
 */
module.exports = Extender;

/**
 * Module dependencies.
 */
var utils = require('../../utils');

/**
 * Initialize a new extender class processor.
 *
 * @param {danf:object.classesRegistry} classesRegistry The classes registry.
 * @param {function} baseClass The base class name.
 */
function Extender(classesRegistry, baseClassName) {
    if (classesRegistry) {
        this.classesRegistry = classesRegistry;
    }
    if (baseClassName) {
        this.baseClassName = baseClassName;
    }
}

Extender.defineImplementedInterfaces(['danf:object.classProcessor']);

Extender.defineDependency('_classesRegistry', 'danf:object.classesRegistry');
Extender.defineDependency('_baseClassName', 'string');

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
 * Set the base class name.
 *
 * @param {function} baseClassName The base class name.
 * @api public
 */
Object.defineProperty(Extender.prototype, 'baseClassName', {
    set: function(baseClassName) { this._baseClassName = baseClassName; }
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

    if (!class_.Parent) {
        if (extendedClassName) {
            var parent = this._classesRegistry.get(extendedClassName);

            this.process(parent);

            class_.Parent = parent;
            utils.extend(parent, class_);
        } else {
            var baseClass = this._classesRegistry.get(this._baseClassName);

            if (baseClass !== class_) {
                utils.extend(baseClass, class_);
            }
        }
    }
}
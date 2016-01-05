'use strict';

/**
 * Expose `Extender`.
 */
module.exports = Extender;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new extender class processor.
 */
function Extender() {
}

utils.extend(Abstract, Extender);

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
    if (!class_.Parent) {
        var extendedClassName = class_.__metadata.extends,
            prototype = Object.getPrototypeOf(class_.prototype)
        ;

        if (extendedClassName) {
            var parent = this._classesContainer.get(extendedClassName);

            this.process(parent);
            class_.Parent = parent;
            utils.extend(parent, class_);
        } else if (prototype.__reference) {
            class_.__metadata.extends = prototype.__reference;
            prototype.__construct = function() {
                var args = Array.prototype.slice.call(arguments, 1),
                    object = new (Function.prototype.bind.apply(class_.Parent, args))
                ;

                for (var propertyName in object) {
                    if (object.hasOwnProperty(propertyName)) {
                        this[propertyName] = object[propertyName];
                    }
                }
            }

            this.process(class_);

            return;
        }
    }

    if (class_.Parent) {
        var parent = class_.Parent;

        // Inherit interfaces implementation.
        if (!class_.__metadata.implements) {
            class_.__metadata.implements = [];
        }

        var implementedInterfaces = class_.__metadata.implements.concat(parent.__metadata.implements || []),
            uniqueImplementedInterfaces = []
        ;

        for (var i = 0; i < implementedInterfaces.length; i++) {
            if (-1 == uniqueImplementedInterfaces.indexOf(implementedInterfaces[i])) {
                uniqueImplementedInterfaces.push(implementedInterfaces[i]);
            }
        }

        class_.__metadata.implements = uniqueImplementedInterfaces;

        // Inherit dependencies.
        if (!class_.__metadata.dependencies) {
            class_.__metadata.dependencies = {};
        }

        class_.__metadata.dependencies = utils.merge(
            parent.__metadata.dependencies,
            class_.__metadata.dependencies
        );
    }
}
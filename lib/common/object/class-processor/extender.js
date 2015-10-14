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
        var extendedClassName = class_.__metadata.extends;

        if (extendedClassName) {
            var parent = this._classesContainer.get(extendedClassName);

            this.process(parent);

            class_.Parent = parent;
            utils.extend(parent, class_);
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
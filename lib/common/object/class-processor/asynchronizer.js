'use strict';

/**
 * Expose `Asynchronizer`.
 */
module.exports = Asynchronizer;

/**
 * Initialize a new asynchronizer class processor.
 */
function Asynchronizer() {
}

Asynchronizer.defineImplementedInterfaces(['danf:object.classProcessor']);

/**
 * @interface {danf:object.classProcessor}
 */
Object.defineProperty(Asynchronizer.prototype, 'order', {
    value: 1400
});

/**
 * @interface {danf:object.classProcessor}
 */
Asynchronizer.prototype.process = function (class_) {
    var prototype = class_.prototype;

    while (prototype && prototype !== Object.prototype) {
        var propertiesNames = Object.getOwnPropertyNames(prototype);

        for (var i in propertiesNames) {
            var propertyName = propertiesNames[i],
                property = Object.getOwnPropertyDescriptor(prototype, propertyName).value
            ;

            if ('function' === typeof property) {
                var functionContent = String(property);

                if (-1 !== functionContent.indexOf('.__async(')) {
                    console.log('plop');
                }
            }
        }

        prototype = Object.getPrototypeOf(prototype);
    }
}
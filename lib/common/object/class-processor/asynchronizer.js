'use strict';

/**
 * Expose `Asynchronizer`.
 */
module.exports = Asynchronizer;

/**
 * Initialize a new asynchronizer class processor.
 *
 * @param {danf:manipulation.flowDriver} flowDriver The flow driver.
 */
function Asynchronizer(flowDriver) {
    if (flowDriver) {
        this.flowDriver = flowDriver;
    }
}

Asynchronizer.defineImplementedInterfaces(['danf:object.classProcessor']);

Asynchronizer.defineDependency('_flowDriver', 'danf:manipulation.flowDriver');

/**
 * Set the flow driver.
 *
 * @param {danf:object.flowDriver} flowDriver The flow driver.
 * @api public
 */
Object.defineProperty(Asynchronizer.prototype, 'flowDriver', {
    set: function(flowDriver) { this._flowDriver = flowDriver; }
});

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
            (function(prototype, propertyName) {
                var propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyName),
                    property = propertyDescriptor.value
                ;

                if ('function' === typeof property) {
                    var functionContent = String(property);

                    if (-1 !== functionContent.indexOf('.__async(')) {
                        propertyDescriptor.value = function() {
                            var self = this,
                                args = Array.prototype.slice.call(arguments, 1),
                                task = function() {
                                    return property.apply(self, args);
                                }
                            ;

                            this.flowDriver.series([task], function(error, results) {

                            });
                        }
                    }
                }
            })(prototype, propertiesNames[i]);
        }

        prototype = Object.getPrototypeOf(prototype);
    }
}
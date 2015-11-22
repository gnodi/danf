'use strict';

module.exports = {
    // Define a service.
    computer: {
        // Define service class name. By default, the name of a class is a
        // logical name built from its path:
        // /lib/server/class.js => class
        // /lib/server/foo/bar.js => foo.bar
        // /lib/common/class.js => class
        // /node_modules/dependency/lib/common/class.js => dependency:class
        class: 'computer',
        // Define the injected properties of the service.
        properties: {
            // Inject the services belonging to collection 'processor'
            // into property 'processor'.
            processors: '&processor&'
        }
    },
    processor: {
        class: 'processor',
        // Link the service to some collections.
        collections: ['processor'],
        // Define children services inheriting their abstract parent
        // definition attributes (here 'class' and 'collections').
        children: {
            // Define a first child whom full name is 'processor.inc'.
            inc: {
                properties: {
                    order: 0,
                    operand: 1,
                    operation: function(value, operand) {
                        return value + operand;
                    }
                }
            },
            // Define a second child whom full name is 'processor.mul'.
            mul: {
                properties: {
                    order: 1,
                    operand: 2,
                    operation: function(value, operand) {
                        return value * operand;
                    }
                }
            }
        }
    }
};
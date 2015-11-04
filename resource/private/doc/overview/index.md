Danf Overview
=============

[←](../index.md)

Services
--------

The service is the base element of the dependency injection and then of your architecture.

Take an asynchronous computer and a processor mock classes:

```javascript
// lib/server/computer.js

'use strict';

module.exports = Computer;

function Computer() {
}

// Define a dependency that the dependency injection should set.
// The private property '_processors' should be an array of objects, instances of
// the interface 'processor'.
Computer.defineDependency('_processors', 'processor_array');

// Define a property.
Object.defineProperty(Computer.prototype, 'processors', {
    get: function() { return this._processors; },
    set: function(processors) {
        this._processors = [];

        for (var i in processors) {
            var processor = processors[i];

            this._processors[processor.order] = processor;
        }
    }
});

// Define a method.
Computer.prototype.compute = function(value, timeout) {
    // Wrap an asynchronous operation in order to return the result to the stream.
    this.__asyncProcess(function(returnAsync) {
        // Simulate an asynchronous computing.
        setTimeout(
            function() {
                for (var i in this._processors) {
                    value = this._processors[i].process(value);
                }

                // Return the computed value to the stream.
                returnAsync(value);
            },
            timeout
        );
    });
}
```

> The only differences between a synchronous and an asynchronous method is the wrapping `this.__asyncProcess(function(returnAsync) { ... }` and the use of `returnAsync(value)` instead of `return value;`.

```javascript
// lib/server/processor.js

'use strict';

module.exports = Processor;

function Processor() {
}

// Define the implemented interfaces of the class.
Computer.defineImplementedInterfaces(['processor']);

Computer.defineDependency('_order', 'number');
Computer.defineDependency('_operand', 'number');
Computer.defineDependency('_operation', 'function');

Object.defineProperty(Processor.prototype, 'order', {
    get: function() { return this._order; },
    set: function(order) { this._order = order; }
});

Object.defineProperty(Processor.prototype, 'operand', {
    get: function() { return this._operand; },
    set: function(operand) { this._operand = operand; }
});

Object.defineProperty(Processor.prototype, 'operation', {
    get: function() { return this._operation; },
    set: function(operation) { this._operation = operation; }
});

Processor.prototype.process = function(value) {
    return this._operation(value, this._operand);
}
```

Here is the definition of the services you need if you want to have a computer which increment the input value by 1 then multiply it by 2:

```javascript
// config/server/config/services.js

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
```

And the definition of the interface for the processors:

```javascript
// config/server/config/interfaces.js

'use strict';

module.exports = {
    // Define an interface.
    processor: {
        // Define the methods of the interface.
        methods: {
            // Define a method with its arguments and return value types.
            // '/value' is used for readability and debugging only.
            process: {
                arguments: ['number/value'],
                returns: 'number'
            }
        }
    }
};
```

[←](../index.md)
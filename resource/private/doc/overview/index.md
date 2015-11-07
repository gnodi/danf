Danf Overview
=============

[←](../index.md)

Model
-----

*The model layer is the layer contening your business code and allowing you to define a complex modular OOP SOA architecture.*

Let's explain with an example. Take an asynchronous computer and a processor mock classes:

```javascript
// lib/common/computer.js

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
    // Handle asynchronous computing.
    if (timeout) {
        // Wrap an asynchronous operation in order to return the result to the stream.
        this.__asyncProcess(function(returnAsync) {
            // Simulate an asynchronous computing.
            setTimeout(
                function() {
                    for (var i = 0; i < this._processors.length; i++) {
                        value = this._processors[i].process(value);
                    }

                    // Return the computed value to the stream.
                    returnAsync(value);
                },
                timeout
            );
        });
    // Handle synchronous computing.
    } else {
        for (var i = 0; i < this._processors.length; i++) {
            value = this._processors[i].process(value);
        }

        // Return the computed value to the stream.
        return value;
    }
}
```

> The only differences between a synchronous and an asynchronous method is the wrapping `this.__asyncProcess(function(returnAsync) { ... }` and the use of `returnAsync(value)` instead of `return value;`.

```javascript
// lib/common/processor.js

'use strict';

module.exports = Processor;

function Processor() {
}

// Define the interfaces implemented by the class.
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
// config/common/config/services.js

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
// config/common/config/interfaces.js

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

Sequencing
----------

*The sequencing layer is the layer responsible for managing asynchronicity and calling the model layer.*

Here is a really simple sequence using the code defined in the model layer.

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    // Define a sequence.
    simple: {
        // Check input stream.
        // The input stream is an object with a property 'value'
        // and a property 'timeout'.
        stream: {
            value: {
                type: 'number',
                required: true
            },
            timeout: {
                type: 'number',
                default: 10
            }
        },
        // Define the processed operations.
        operations: [
            // Define an operation which is a call to a method
            // of a service with some arguments.
            // '@value@' and '@timeout@' are references resolved from the stream.
            // The scope is the property which will be impacted by
            // the (synchronous or asynchronous!) return of the method.
            {
                service: 'computer',
                method: 'compute',
                arguments: ['@value@', '@timeout@'],
                scope: 'value'
            }
        ]
    }
};
```

Examples (input stream => output stream):
- `{value: 10, timeout: 10}` => `{value: 22, timeout: 10}` // asynchronous
- `{value: 10, timeout: 0}` => `{value: 22, timeout: 0}` // synchronous

> The way of defining the sequence does not differ for synchronous or asynchronous processing.

Now, let's take a little bit more complicated sequence:

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    unpredictable: {
        operations: [
            {
                service: 'computer',
                method: 'compute',
                arguments: [2, 10],
                scope: 'value'
            },
            {
                service: 'computer',
                method: 'compute',
                arguments: [6, 10],
                scope: 'value'
            }
        ]
    }
};
```

Here, the result will be unpredictable because the 2 asynchronous operations will be executed in parallel. The property `value` of the stream will take the value of the last finishing operation. This is obviously not what you wanted to do.

**First case:** you wanted to retrieve the 2 values:

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    parallel: {
        operations: [
            // Use 2 different scopes.
            {
                service: 'computer',
                method: 'compute',
                arguments: [2, 10],
                scope: 'value1'
            },
            {
                service: 'computer',
                method: 'compute',
                arguments: [6, 10],
                scope: 'value2'
            }
        ]
    }
};
```

Example (input stream => output stream):
- `{}` => `{value1: 6, value2: 14}`

**Second cases:** you wanted to process the first computing then use the result as input for the second one:

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    series: {
        operations: [
            // Define an order.
            // Operations of the same order execute in parallel.
            // Operations of the same order execute in series.
            // By default, order is set to 0.
            {
                order: 0,
                service: 'computer',
                method: 'compute',
                arguments: [2, 10],
                scope: 'value'
            },
            {
                order: 1,
                service: 'computer',
                method: 'compute',
                arguments: ['@value@', 10],
                scope: 'value'
            }
        ]
    }
};
```

Example (input stream => output stream):
- `{}` => `{value: 14}`

You can also execute operations on arrays and objects.

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    collection: {
        operations: [
            // Define an order.
            // Operations of the same order execute in parallel.
            // Operations of the same order execute in series.
            {
                service: 'computer',
                method: 'compute',
                // Define the arguments for each item.
                // '@@.@@' is a reference resolved in the context of
                // the collection item.
                arguments: ['@@.@@'],
                scope: 'value',
                // Define processing on a collection.
                collection: {
                    // Define the input collection.
                    input: [2, 3, 4],
                    // Define the async method used.
                    method: '||'
                }
            }
        ]
    }
};
```

Example (input stream => output stream):
- `{}` => `{value: [6, 8, 10]}`

> You can use all the [collections method of the async lib](https://github.com/caolan/async#collections).
> `||` is a shorcut for method `forEachOf`.

Event
-----

*The event layer is the layer responsible for linking sequences to specific event like an HTTP request, a click on a DOM element, ...*



[←](../index.md)
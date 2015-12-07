Danf Overview
=============

[←](../index.md)

This quick overview will give you an idea of the architecture and possibilities of the framework. A fast read should take you about 10 minutes and an accurate one about 30 minutes.

If you want to test it by yourself, [start a new application](../installation.md) and copy/paste the following code in the right files. If you are tired, you can use the code available [here](../../../../test/functional/proto/overview) (do not forget to make a `npm install` if you use this last one).

Model
-----

*The model layer is the layer contening your business code and allowing you to define a complex modular OOP SOA architecture.*

![model](../../img/architecture-model.png)

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
    var self = this;

    // Handle asynchronous computation.
    if (timeout) {
        // Wrap an asynchronous operation in order to return the result to the stream.
        this.__asyncProcess(function(returnAsync) {
            // Simulate an asynchronous computation.
            setTimeout(
                function() {
                    for (var i = 0; i < self._processors.length; i++) {
                        value = self._processors[i].process(value);
                    }

                    // Return the computed value to the stream.
                    returnAsync(value);
                },
                timeout
            );
        });
    // Handle synchronous computation.
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
Processor.defineImplementedInterfaces(['processor']);

Processor.defineDependency('_order', 'number');
Processor.defineDependency('_operand', 'number');
Processor.defineDependency('_operation', 'function');

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

And the definition of the interface for the processors (allowing to ensure signatures, define a contract and make a low coupling between the computer and its processors):

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
        },
        // Define the getters of the interface.
        getters: {
            order: 'number'
        }
    }
};
```

Sequencing
----------

*The sequencing layer is the layer responsible for managing asynchronicity and calling the model layer.*

![sequencing](../../img/architecture-sequencing.png)

Here is a really simple sequence using the code defined in the model layer.

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    // Define a sequence.
    simple: {
        // Check input stream.
        // The input stream is an object with a property 'value',
        // a property 'timeout' and a property 'name'.
        // Not defining this will result in a free stream input.
        stream: {
            value: {
                type: 'number',
                required: true
            },
            timeout: {
                type: 'number',
                default: 10
            },
            name: {
                type: 'string',
                required: true
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
        ],
        // Link the sequence to some collections.
        collections: ['computation']
    }
};
```

Examples (input stream => output stream):
- `{name: 'foo', value: 10, timeout: 10}` => `{name: 'foo', value: 22, timeout: 10}` // asynchronous
- `{name: 'foo', value: 10, timeout: 0}` => `{name: 'foo', value: 22, timeout: 0}` // synchronous

> The way of defining the sequence does not differ for synchronous or asynchronous processing.

Now, let's take a little bit more complicated sequence:

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    // ...
    unpredictable: {
        stream: {
            value: {
                type: 'number',
                default: 2
            },
            name: {
                type: 'string',
                required: true
            }
        },
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
                arguments: [3, 10],
                scope: 'value'
            }
        ],
        collections: ['computation']
    }
};
```

Here, the result will be unpredictable because the 2 asynchronous operations will be executed in parallel. The property `value` of the stream will take the value of the last finishing operation (most of the time the second one but not always). This is obviously not what you wanted to do.

**First case:** you wanted to retrieve the 2 values:

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    // ...
    parallel: {
        stream: {
            value1: {
                type: 'number',
                default: 2
            },
            value2: {
                type: 'number',
                default: 3
            },
            name: {
                type: 'string',
                required: true
            }
        },
        operations: [
            // Use 2 different scopes.
            {
                service: 'computer',
                method: 'compute',
                arguments: ['@value1@', 10],
                scope: 'value1'
            },
            {
                service: 'computer',
                method: 'compute',
                arguments: ['@value2@', 10],
                scope: 'value2'
            }
        ],
        collections: ['computation']
    }
};
```

Example (input stream => output stream):
- `{name: 'foo', value1: 2, value2: 3}` => `{name: 'foo', value1: 6, value2: 8}`

**Second cases:** you wanted to process the first computation then use the result as input for the second one:

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    // ...
    series: {
        stream: {
            value: {
                type: 'number',
                default: 2
            },
            name: {
                type: 'string',
                required: true
            }
        },
        operations: [
            // Define an order.
            // Operations of the same order execute in parallel.
            // Operations of the same order execute in series.
            // By default, order is set to 0.
            {
                order: 0,
                service: 'computer',
                method: 'compute',
                arguments: ['@value@', 10],
                scope: 'value'
            },
            {
                order: 1,
                service: 'computer',
                method: 'compute',
                arguments: ['@value@', 10],
                scope: 'value'
            }
        ],
        collections: ['computation']
    }
};
```

Example (input stream => output stream):
- `{name: 'foo', value: 2}` => `{name: 'foo', value: 14}`

You can also execute operations on arrays and objects.

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    // ...
    collection: {
        stream: {
            value: {
                type: 'number_array',
                default: [2, 3, 4]
            },
            name: {
                type: 'string',
                required: true
            }
        },
        operations: [
            {
                service: 'computer',
                method: 'compute',
                // Define the arguments for each item.
                // '@@.@@' is a reference resolved in the context of
                // the collection item.
                // Taking the default value of stream property 'value',
                // the collection items are 2, 3 and 4.
                // @@.@@ will resolve in 2, 3 and 4.
                arguments: ['@@.@@'],
                scope: 'value',
                // Define processing on a collection.
                collection: {
                    // Define the input collection.
                    input: '@value@',
                    // Define the async method used.
                    method: '||'
                }
            }
        ],
        collections: ['computation']
    }
};
```

Example (input stream => output stream):
- `{name: 'bar', value: [2, 3, 4]}` => `{name: 'bar', value: [6, 8, 10]}`

> You can use all the [collections method of the async lib](https://github.com/caolan/async#collections).
> `||` is a shorcut for method `forEachOf`.

You can add operations to another sequence or collection of sequences using the attribute `parents`. Here is a sequence which will
log the computations:

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    // ...
    log: {
        operations: [
            {
                // Define sequence internal order.
                order: 0,
                // Use the danf callback executor (only use it for test)
                // to set a stringified stream.
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(stream) {
                        var valueStream = {};

                        for (var key in stream) {
                            if (0 === key.indexOf('value')) {
                                valueStream[key] = stream[key];
                            }
                        }

                        return JSON.stringify(valueStream);
                    },
                    '@stream@'
                ],
                scope: 'stream'
            },
            {
                order: 1,
                // Use the danf logger to log input and output.
                service: 'danf:logging.logger',
                method: 'log',
                // Define the string to log. Some references can be
                // resolved inside a string.
                arguments: ['<<@color@>>@name@ @text@: <<bold>>@stream@']
            }
        ],
        // Add operations on sequences belonging to the collection
        // 'computation'.
        parents: [
            {
                // Define the order relatively to the parent sequence.
                order: -10,
                // Define the target as the collection 'computation'.
                target: '&computation&',
                // Define the input of the sequence in the context of
                // the parent sequence stream.
                input: {
                    stream: '@.@',
                    text: 'input',
                    color: 'magenta',
                    name: '@name@'
                }
            },
            {
                order: 10,
                target: '&computation&',
                input: {
                    stream: '@.@',
                    text: 'output',
                    color: 'blue',
                    name: '@name@'
                }
            }
        ]
    }
};
```

In reverse, you can use a sequence in another sequence thanks to the attribute `children`. Here is a sequence which will aggregate all the computations:

```javascript
// config/common/config/sequences.js

'use strict';

module.exports = {
    // ...
    compute: {
        // Add operations to the list of operations of this sequence.
        // Here the sequence has no own operations.
        children: [
            {
                // Define the order relatively to this sequence.
                order: 0,
                // Define the name of the child sequence.
                name: 'simple',
                input: {
                    value: 2,
                    name: 'simple'
                },
                output: {
                    result: {
                        simple: '@.@'
                    }
                }
            },
            {
                order: 0,
                name: 'unpredictable',
                input: {
                    name: 'unpredictable'
                },
                output: {
                    result: {
                        unpredictable: '@.@'
                    }
                }
            },
            {
                order: 0,
                name: 'parallel',
                input: {
                    name: 'parallel'
                },
                output: {
                    result: {
                        parallel: '@.@'
                    }
                }
            },
            {
                order: 0,
                name: 'series',
                input: {
                    name: 'series'
                },
                output: {
                    result: {
                        series: '@.@'
                    }
                }
            },
            {
                order: 0,
                name: 'collection',
                input: {
                    name: 'collection'
                },
                output: {
                    result: {
                        collection: '@.@'
                    }
                }
            }
        ]
    }
};
```

In this last sequence, all the computations will be executed in parallel because the order is the same for every children.

> It is a good practice to use an action name for your sequence.
> `simple` is bad.
> `compute` is good.

Event
-----

*The event layer is the layer responsible for linking sequences to specific event like an HTTP request, a click on a DOM element, ...*

![event](../../img/architecture-event.png)

If you look at the path of the previously defined config, you can see that it has been done in the folder `/config/common`. This means that you will be able to use it on both client and server sides.

The following definition will link computations to a server request:

```javascript
// config/server/config/events/request.js

'use strict';

module.exports = {
    // Define a request.
    home: {
        // Define the path of the request.
        path: '/',
        // Define the available HTTP methods.
        methods: ['get'],
        // Link the sequences.
        // This works the same as the definition
        // of children sequences of a sequence.
        sequences: [
            {
                name: 'compute',
                // Set the field "result" of the sequence
                // output stream in the field "result"
                // of the event stream.
                output: {
                    result: '@result@'
                }
            }
        ],
        // Define the view.
        view: {
            // Define an HTML view.
            // It is possible to define a JSON and
            // a text view too (or in place).
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/index.jade'
                }
            }
        }
    }
};
```

> `%view.path%` is a parameter containing the path of your current module (`resource/private/view` by default).
> [Jade](http://jade-lang.com/) is the default template engine, but you can use another one [like explained in Express](http://expressjs.com/guide/using-template-engines.html).

You can update your default `index.jade` to display the server computations:

```jade
//- resource/private/view/index.jade

h1 Overview

p Here is the output of the server computations:

ul
    li= 'Simple: ' + JSON.stringify(result.simple)
    li= 'Unpredictable: ' + JSON.stringify(result.unpredictable)
    li= 'Parallel: ' + JSON.stringify(result.parallel)
    li= 'Series: ' + JSON.stringify(result.series)
    li= 'Collection: ' + JSON.stringify(result.collection)

p Take a look at your console to see the client computations!
```

> The event stream is used as jade locals variable.

The following definition will link the same computations to a client DOM ready event:

```javascript
// config/client/config/events/dom.js

'use strict';

module.exports = {
    // Define a (jquery) dom event.
    ready: {
        event: 'ready',
        sequences: [
            {
                name: 'compute'
            }
        ]
    }
};
```

Now, if you start the server with the command `node app-prod` and ask for `http://localhost:3080/` in your browser, you should be able to see the result of your computations in both your server and browser consoles.

> Note that all the dependencies and sequencing is coded into configuration files. This gives you a pretty scalable dynamic application.

This overview is just a really simple example to show the structure of the framework. Take a look at the [full documentation](../documentation/index.md) to deepen your understanding and your possibilities. All the code is available [here](../../../../test/functional/proto/overview).

[←](../index.md)
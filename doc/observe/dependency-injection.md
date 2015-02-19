Inject services into each others
================================

[←](index.md)

A functional version of the code of this example can be found [here](../../test/functional/example/dependency-injection).

Example
-------

Here is an example of config with effective dependency injection:

```javascript
// app.js

'use strict';

var danf = require('danf');

danf({
    config: {
        classes: {
            processor: {
                // "adder" and "multiplier" inherit from "abstract".
                // You can see how it works in the details of the classes below.
                abstract: require('./abstract-processor'),
                adder: require('./adder'),
                multiplier: require('./multiplier')
            },
            parser: require('./parser'),
            computer: require('./computer')
        },
        interfaces: {
            computer: {
                methods: {
                    compute: {
                        arguments: ['string/operation'],
                        returns: 'string'
                    }
                }
            },
            processor: {
                methods: {
                    process: {
                        arguments: ['number/operand1', 'number/operand2'],
                        returns: 'number'
                    }
                },
                getters: {
                    operation: 'string'
                }
            },
            parser: {
                methods: {
                    parse: {
                        arguments: ['string/operation'],
                        returns: 'string_array'
                    }
                }
            }
        },
        services: {
            processor: {
                tags: ['processor'],
                // Define children services which will inherit the tag.
                // This feature is mainly used to improve readability.
                // The names of the services are "processor.adder" and "processor.multiplier".
                children: {
                    adder: {
                        class: 'processor.adder'
                    },
                    multiplier: {
                        class: 'processor.multiplier'
                    }
                }
            },
            parser: {
                class: 'parser'
            },
            computer: {
                class: 'computer',
                // Set the properties of the service "computer".
                properties: {
                    // Inject in the property "parser" the service "parser".
                    parser: '#parser#',
                    // Inject in the property "processors" the services tagged with "processor".
                    processors: '&processor&'
                }
            }
        },
        sequences: {
            computeOperation: [
                {
                    service: 'computer',
                    method: 'compute',
                    arguments: ['@operation@'],
                    returns: 'result'
                }
            ]
        },
        events: {
            request: {
                hello: {
                    path: '/',
                    methods: ['get'],
                    parameters: {
                        operation: {
                            type: 'string',
                            required: true
                        }
                    },
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/index.jade'
                            }
                        }
                    },
                    sequences: ['computeOperation']
                }
            }
        }
    }
});
```

Here is the related classes and view:

```javascript
// abstract-processor.js

'use strict';

/**
 * Expose `AbstractProcessor`.
 */
module.exports = AbstractProcessor;

/**
 * Initialize a new abstract processor.
 */
function AbstractProcessor() {
    Object.hasGetter(this, 'neutralElement');
    Object.hasMethod(this, 'processOperation');
}

AbstractProcessor.defineImplementedInterfaces(['processor']);

// Define the class as an abstract non instantiable class.
AbstractProcessor.defineAsAbstract();

/**
 * @interface {processor}
 */
AbstractProcessor.prototype.process = function(operand1, operand2) {
    if (undefined === operand2) {
        operand2 = this.neutralElement;
    }

    return this.processOperation(operand1, operand2);
}
```

```javascript
// adder.js

'use strict';

/**
 * Expose `Adder`.
 */
module.exports = Adder;

/**
 * Initialize a new adder processor.
 */
function Adder() {
}

Adder.defineImplementedInterfaces(['processor']);

// Define the inherited class.
Adder.defineExtendedClass('processor.abstract');

/**
 * @interface {processor}
 */
Object.defineProperty(Adder.prototype, 'operation', {
    get: function() { return '@'; }
});

/**
 * @inheritdoc
 */
Object.defineProperty(Adder.prototype, 'neutralElement', {
    get: function() { return 0; }
});

/**
 * @inheritdoc
 */
Adder.prototype.processOperation = function(operand1, operand2) {
    return operand1 + operand2;
}
```

```javascript
// multiplier.js

'use strict';

/**
 * Expose `Multiplier`.
 */
module.exports = Multiplier;

/**
 * Initialize a new multiplier processor.
 */
function Multiplier() {
}

Multiplier.defineImplementedInterfaces(['processor']);

// Define the inherited class.
Multiplier.defineExtendedClass('processor.abstract');

/**
 * @interface {processor}
 */
Object.defineProperty(Multiplier.prototype, 'operation', {
    get: function() { return '*'; }
});

/**
 * @inheritdoc
 */
Object.defineProperty(Multiplier.prototype, 'neutralElement', {
    get: function() { return 1; }
});

/**
 * @inheritdoc
 */
Multiplier.prototype.processOperation = function(operand1, operand2) {
    return operand1 * operand2;
}
```

```javascript
// parser.js

'use strict';

/**
 * Expose `Parser`.
 */
module.exports = Parser;

/**
 * Initialize a new adder processor.
 */
function Parser() {
}

Parser.defineImplementedInterfaces(['parser']);

/**
 * @interface {processor}
 */
Parser.prototype.parse = function(operation) {
    return operation.split(' ');
}
```

```javascript
// computer.js

'use strict';

/**
 * Expose `Computer`.
 */
module.exports = Computer;

/**
 * Initialize a new adder processor.
 */
function Computer() {
    this._processors = {};
    this._parser;
}

Computer.defineImplementedInterfaces(['computer']);

// Define dependencies in order to check their correct injection, ensure interfaces, ...
Computer.defineDependency('_parser', 'parser');
Computer.defineDependency('_processors', 'processor_object');

/**
 * @interface {processor}
 */
Computer.prototype.compute = function(operation) {
    var parsedOperation = this._parser.parse(operation),
        result = parseInt(parsedOperation.shift(), 10)
    ;

    for (var i = 0; i < parsedOperation.length; i = i + 2) {
        result = getProcessor.call(this, parsedOperation[i])
            .process(result, parseInt(parsedOperation[i + 1]))
        ;
    }

    return result;
}

Object.defineProperty(Computer.prototype, 'parser', {
    set: function(parser) { this._parser = parser; }
});

Object.defineProperty(Computer.prototype, 'processors', {
    set: function(processors) {
        for (var i = 0; i < processors.length; i++) {
            var processor = processors[i];

            this._processors[processor.operation] = processor;
        }
    }
});

/**
 * @interface {processor}
 */
Computer.prototype.parse = function(operation) {
    return operation.slit(' ');
}

var getProcessor = function(operation) {
    if (undefined === this._processors[operation]) {
        throw new Error('No operation "{0}" found.'.format(operation));
    }

    return this._processors[operation];
}
```

```jade
//- index.jade

p
  = 'Result: ' + result
```

> Test it executing: `$ node app.js`
>
> * `http://localhost:3080/?operation=3 * 2 @ 4` // Result: 10
> * `http://localhost:3080/?operation=3 @ 2 * 4` // Result: 20

Navigation
----------

[Use a class on both the client and server sides](client-server-class.md) |

[←](index.md)
Develop with Object-Oriented Programming
========================================

[←](index.md)

Documentation
-------------

###Define a class

```javascript
// lib/server/computer.js

'use strict';

module.exports = Computer;

// Constructor.
function Computer() {
}

// Property.
Object.defineProperty(Computer.prototype, 'host', {
    get: function() { return this._host; },
    set: function(host) { this._host = host; }
});

// Method.
Computer.prototype.compute = function() {
    // ...
}
```

The definition of a class is really easy, you just have to declare a function and return it with `module.exports` as in any other node file.
You can, then, define some properties and some methods on this function as shown in this example.

###Declare a class

To make a class use all the features of the framework you have to declare it in the configuration.
You have two choices:

* You can declare it directly in the `classes` section.

```javascript
// config/classes.js

'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        computer: require('../../lib/server/computer')
    };
});
```

* However, it is a good practice to declare it as a parameter. You will see why in next sections.

```javascript
// config/server/parameters.js

'use strict';

module.exports = {
    classes: {
        computer: require('../../lib/server/computer')
    }
};
```

This is done by default in the proto application (you don't have to do it) but the parameters are linked to the classes section in this manner:

```javascript
// config/classes.js

'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return '%classes%';
});
```

You can notice that the name referencing your class is `computer` in both cases.

###Inherit from a class

```javascript
// lib/server/computer.js

'use strict';

module.exports = SuperComputer;

// Constructor.
function SuperComputer() {
    SuperComputer.Parent.call(this);
}

SuperComputer.defineExtentedClass('computer');

// Method.
SuperComputer.prototype.compute = function() {
    // ...
}
```

You can inherit from a class using the method `defineExtentedClass` on the child class and passing the declared name of the class.
It is possible to call the parent constructor using `.Parent.call(this, ...);` in the constructor of the child class.

###Use an abstract class

You can use non-instantiable class:

```javascript
// lib/server/computer.js

'use strict';

module.exports = AbstractComputer;

// Constructor.
function AbstractComputer() {
    Object.hasMethod(this, 'compute', true);
}

// Define the class as an abstract class.
AbstractComputer.defineAsAbstract();

// Abstract method.
AbstractComputer.prototype.compute = null;
```

The method call `defineAsAbstract` on the class will define the class as abstract and prevent it to be instantiated.
`Object.hasMethod(this, 'compute', true);` called in the constructor forces child classes to define the method `compute`.

###Inherit from a class of a dependency

Imagine, you have the following configuration with a dependency on a danf module called `lab`:

```javascript
// danf.js

module.exports = {
    dependencies: {
        lab: require('lab')
    },
    contract: {
    },
    config: {
    }
};
```

Lab define a class `abstractComputer`.
You can inherit from that class in your own module:

```javascript
// lib/server/my-computer.js

'use strict';

module.exports = MyComputer;

// Constructor.
function MyComputer() {
}

MyComputer.defineExtentedClass('lab:abstractComputer');
```

###Define interfaces

Like it is explained in the [concepts](../concepts.md), interfaces are really important in object architectures.

In Danf, interfaces assume two roles as a good native object langage would do:
* Ensure the respect of the contract they define.
* Create a scope preventing to call any method not defined by the interface.

Danf highly encourages their use and provides an easy way to define them:

```javascript
// config/server/interfaces.js

'use strict';

module.exports = {
    computer: {
        methods: {
            /**
             * Compute.
             *
             * @param {boolean_array} operations The boolean operations.
             * @return {boolean} The result of the computing.
             */
            compute: {
                arguments: ['boolean_array/operations'],
                returns: 'boolean'
            }
        },
        getters: {
            /**
             * The host.
             *
             * @return {string}
             */
            host: 'string',
            /**
             * The processor.
             *
             * @return {processor}
             */
            processor: 'processor'
        },
        setters: {
            /**
             * The host.
             *
             * @param {string}
             */
            host: 'string',
            /**
             * The processor.
             *
             * @param {processor}
             */
            processor: 'processor'
        }
    },
    processor: {
        methods: {
            /**
             * Process.
             *
             * @param {boolean} operation The boolean operation.
             * @param {boolean} previousState The previous state.
             * @return {boolean} The result of the processing.
             */
            process: {
                arguments: ['boolean/operation', 'boolean|undefined/previousState'],
                returns: 'boolean'
            }
        }
    },
    sequencer: {
        methods: {
            /**
             * Wake.
             */
            wake: {
            }
        }
    }
};
```

You can define methods, getters and/or setters. You can specify the same types as used for the contracts in the [configuration](configuration.md) but you can also specify interfaces.

You can define a multitype field `string|number`.

So, an optional value can be noted `...|undefined`.

`...` can be used to tell that a variable number of arguments of this type can appear:
* `string...` means 1 or N string arguments.
* `string...|undefined` means 0 or N string arguments.
You can use this many times in the same list of arguments and at any places.

This will works: `arguments: ['processor', 'string...|number...', 'number...|undefined', 'undefined|boolean']`.

###Link interfaces to classes

To tell that a class implements an interface you just have to call `defineImplementedInterfaces` on the class and pass it a list of the implemented interfaces. This is transitive, you do not have to call it in child classes.

```javascript
// lib/server/computer.js

'use strict';

module.exports = Computer;

/**
 * Constructor.
 */
function Computer() {
}

Computer.defineImplementedInterfaces(['computer']);

Computer.defineDependency('_host', 'string');
Computer.defineDependency('_processor', 'processor');

/**
 * @interface {computer}
 */
Object.defineProperty(Computer.prototype, 'host', {
    get: function() { return this._host; },
    set: function(host) { this._host = host; }
});

/**
 * @interface {computer}
 */
Object.defineProperty(Computer.prototype, 'processor', {
    get: function() { return this._processor; },
    set: function(processor) { this._processor = processor; }
});

/**
 * @interface {computer}
 */
Computer.prototype.compute = function(operations) {
    var result = true;

    for (var i = 0; i < operations.length; i++) {
        result = this._processor.process(operations[i], result);
    }

    return result;
}
```

```javascript
// lib/server/processor.js

'use strict';

module.exports = Processor;

/**
 * Constructor.
 */
function Processor() {
}

Processor.defineImplementedInterfaces(['processor', 'sequencer']);

/**
 * @interface {processor}
 */
Processor.prototype.process = function(operation, previousState) {
    return operation && previousState;
}

/**
 * @interface {sequencer}
 */
Processor.prototype.wake = function() {
    // ...
}

/**
 * @api protected
 */
Processor.prototype.wait = function() {
    // ...
}
```

You will see in the [dependency injection](dependency-injection.md) section how to inject a processor in a computer but imagine that an instance of `Processor` has been injected in an instance of `Computer` here.

The call of `defineDependency` on the class `Computer` is going to allow:
* To check that the processor is implementing the interface `processor` (`Computer.defineDependency('_processor', 'processor');`).
* To create a proxy on the processor preventing to call methods, getters and setters which are not defined by the interface.

In this example, the instance of `Processor` implements the interface `processor` (`Processor.defineImplementedInterfaces(['processor']);`) and the instance of `Computer` will be able to call `processor.compute(...)` but not `processor.wake()` or `processor.wait()` (because the interface `processor` only define the method `compute`).

###Inherit from an interface

An interface can inherit from another:

```javascript
// config/server/interfaces.js

'use strict';

module.exports = {
    computer: {
        methods: {
            compute: {
            }
        }
    },
    advancedComputer: {
        extends: 'computer',
        methods: {
            computeOnCore: {
            }
        }
    }
};
```

You just have to set the name of the extended interface in the `extends` parameters of the extender interface.
If `Object.isInstanceOf(computer, 'advancedComputer') === true` then `Object.isInstanceOf(computer, 'computer') === true`.

Navigation
----------

[Previous section](configuration.md) |
 [Next section](dependency-injection.md)

[Application](../test/object.md)

[←](index.md)
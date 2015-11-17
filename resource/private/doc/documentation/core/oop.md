OOP
===

[←](../index.md)

Documentation
-------------

### Classes

#### Define a class

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

The definition of a class is really easy, you just have to declare a function and return it with `module.exports` as in any other node.js file.
You can, then, define some properties and some methods on this function as shown in this example.

> The identifier logical name of your class is `computer`.
> Identifier logical names are built from paths:
> - `/lib/server/class.js` => `class`
> - `/lib/server/foo/bar.js` => `foo.bar`
> - `/lib/common/class.js` => `class`
> The standard module scoping is applying on the classes names:
> - `/node_modules/dependency/lib/common/class.js` => `dependency:class`
> - `/node_modules/dependency/lib/client/foo/bar.js` => `dependency:foo.bar`

#### Inherit from a class

```javascript
// lib/server/super-computer.js

'use strict';

module.exports = SuperComputer;

// Constructor.
function SuperComputer() {
    // Call parent constructor.
    SuperComputer.Parent.call(this);
}

// Define inherited class 
// (use the identifier logical name of the parent class).
SuperComputer.defineExtendedClass('computer');

// Method.
SuperComputer.prototype.compute = function() {
    // Call parent method.
    SuperComputer.Parent.prototype.compute.call(this);

    // ...
}
```

You can inherit from a class using the method `defineExtendedClass` on the child class and passing the declared name of the class.
It is possible to call the parent constructor using `.Parent.call(this, ...);` in the constructor of the child class.

#### Use an abstract class

You can use non-instantiable class:

```javascript
// lib/server/abstract-computer.js

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

> `Object.hasMethod(this, 'compute', true);` called in the constructor forces child classes to define the method `compute`.
> This can be used to define not instantiated protected-like method.

### Interfaces

#### Define an interface

Like it is explained in the [concepts](../concepts.md), interfaces are really important in object architectures.

In Danf, interfaces assume two roles as a good native object langage would do:
* Ensure the respect of the contract they define.
* Create a scope preventing to call any method not defined by the interface (used for low coupling).

Danf highly encourages their use and provides an easy way to define them:

```javascript
// config/server/config/interfaces.js

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

You can define methods, getters and/or setters. You can specify the same types as used for the contracts in the [configuration](configuration.md) but you can also specify some interface types.

You can define a multitype field `string|number`.

So, an optional string can be noted `string|undefined` or `string|null`.

`...` can be used to tell that a variable number of arguments of this type can appear:
* `string...` means 1 or N string arguments.
* `string...|null` means 0 or N string arguments.
You can use this many times in the same list of arguments and at any places.

This will works for instance: `arguments: ['processor', 'string...|number...', 'number...|null', 'undefined|boolean']`.

#### Link an interface to a class

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

// Define implemented interfaces.
Computer.defineImplementedInterfaces(['computer']);

// Define a dependency which must be a string.
Computer.defineDependency('_host', 'string');
// Define a dependency which must be an instance of the interface "processor".
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

// You can define several interfaces of course.
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

You will see in the section [dependency injection](dependency-injection.md) how to inject a processor in a computer but imagine that an instance of `Processor` has been injected in an instance of `Computer` here.

The call of `defineDependency` on the class `Computer` (`Computer.defineDependency('_processor', 'processor');`) is going to allow:
* To check that the processor is implementing the interface `processor`.
* To create a proxy on the processor preventing to call methods, getters and setters which are not defined by the interface.

In this example, the instance of `Processor` implements the interface `processor` (`Processor.defineImplementedInterfaces(['processor']);`) and the instance of `Computer` will be able to call `processor.compute(...)` but not `processor.wake()` or `processor.wait()` (because the interface `processor` only define the method `compute`).

#### Inherit from an interface

An interface can inherit from another:

```javascript
// config/server/config/interfaces.js

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

You just have to set the name of the extended interface in the node `extends` of the extender interface.

> The standard module scoping is applying on the interface names:
> - The name of the interface `int` of the dependency `foo` (`/node_modules/foo`) seen by your module is `foo:int`.
> - The name of the interface `int` of the dependency `bar` of the dependency `foo` (`/node_modules/foo/node_modules/bar`) seen by your module is `foo:bar:int`.
> - The name of the interface `int` of the dependency `bar` of the dependency `foo` (`/node_modules/foo/node_modules/bar`) seen by `foo` is `bar:int`.

Navigation
----------

[< Configuration](configuration.md) | [Dependency Injection >](dependency-injection.md)

[←](../index.md)

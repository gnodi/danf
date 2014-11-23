Use Dependency Injection
========================

[←](index.md)

Documentation
-------------

###Define a service

Dependency injection allows to inject dependencies in a dynamic way. It is certainly the most important concept to apply in order to realize a strong, decoupled, reusable, maintainable, testable architecture.

In Danf, services are the base of the dependency injection. They are defined in the config.

####Class

The most basic definition of a concrete service only need a class:

```javascript
// config/server/service.js

'use strict';

// Computer.
function Computer() {
}

Object.defineProperty(Computer.prototype, 'host', {
    get: function() { return this._host; },
    set: function(host) { this._host = host; }
});

Computer.prototype.compute = function() {
    // ...
}

// Service.
module.exports = {
    computer: {
        class: Computer
    }
};
```

This is possible to define a service this way. However, it is not a good one because you need the class to be accessible by other components (like `classes` config for instance). Furthermore, it is not a good idea to mix the implementation and the config. Here is the way proposed by the proto application:

First, define your class in a separate file:

```javascript
// lib/server/computer.js

'use strict';

module.exports = Computer;

function Computer() {
}

Object.defineProperty(Computer.prototype, 'host', {
    get: function() { return this._host; },
    set: function(host) { this._host = host; }
});

Computer.prototype.compute = function() {
    // ...
}
```

Then, set this class as a parameter:

```javascript
// config/server/parameters.js

'use strict';

module.exports = {
    classes: {
        computer: require('../../lib/server/computer')
    }
};
```

Finally, you can define your service like that:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    computer: {
        class: '%classes.computer%'
    }
};
```

####Properties

You can pass some values and inject some dependencies thanks to the node `properties`:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    processor: {
        class: '%classes.processor%'
    },
    computer: {
        class: '%classes.computer%',
        properties: {
            host: '127.0.0.1',
            processor: '#processor#'
        }
    }
};
```

The classes for the service `processor` is not detailed here, that is not the point. You can pass a value simply by associating a name of a property and a value: `host: '127.0.0.1'`. You can, also, inject a service using the reference of type `#`. Here, we injected the service `processor` to the service `computer`: `processor: '#processor#'`. Note that you can inject the service of one of your dependency (danf module), by prefixing the reference: `processor: '#processingModule:processor#'`. Of course, you can give a parameter (as for the node `class`).

You can make some improvements to the class in order to check that all dependencies will be correctly injected using the method `defineDependency` on the class:

```javascript
// lib/server/computer.js

'use strict';

module.exports = Computer;

function Computer() {
}

Computer.defineImplementedInterfaces(['computer']);

Computer.defineDependency('_host', 'string');
Computer.defineDependency('_processor', 'processor'); // Processor dependency must implement the interface processor.

Object.defineProperty(Computer.prototype, 'host', {
    get: function() { return this._host; },
    set: function(host) { this._host = host; }
});

Object.defineProperty(Computer.prototype, 'processor', {
    get: function() { return this._processor; },
    set: function(host) { this._processor = processor; }
});

Computer.prototype.compute = function() {
    // ...
}
```

It is a really good practice to define your public properties with `Object.defineProperty` to handle the accessibility to the corresponding private `_` properties.

####Abstract

Sometimes, you would like to define some base for other services inside your own module or for the ones using your module. However, it is not an instantiable service because he need some more properties for instance. In that cases, you can use the node `abstract`:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    baseComputer: {
        abstract: true,
        properties: {
            host: '127.0.0.1'
        }
    }
};
```

Note that the class is not mandatory for that kind of service.

####Parent

You can inherit from a parent service to override another definition:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    baseComputer: {
        abstract: true,
        properties: {
            host: '127.0.0.1'
        }
    },
    processor: {
        class: '%classes.processor%'
    },
    computer: {
        class: '%classes.computer%',
        properties: {
            host: 'localhost',
            processor: '#processor#'
        }
    }
};
```

Note that the abstract is not inherited.

####Children

In some cases, you have to define some homogeneous services. The node `children` allows you to easily and visually arrange that:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    processor: {
        class: '%classes.processor%'
    },
    computer: {
        class: '%classes.computer%',
        properties: {
            processor: '#processor#'
        },
        children: {
            local: {
                properties: {
                    host: '127.0.0.1'
                }
            },
            remote: {
                properties: {
                    host: '192.168.0.1'
                }
            }
        }
    }
};
```

This will create 3 definitions of services, 1 abstract: `computer` and 2 definitions which will result in an instanciation: `computer.local` and `computer.remote`. For each child, you can define all the nodes of a standard service (including `children` if you want to chain this structure). The relation between the parent and its children works the same as for the node `parent`.

####Declinations

Another way to define homogeneous services is to use the node `declinations`. Here is an equivalent of the example for the node `children` but with declinations:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    processor: {
        class: '%classes.processor%'
    },
    computer: {
        class: '%classes.computer%',
        declinations: {
            local: {
                host: '127.0.0.1'
            },
            remote: {
                host: '192.168.0.1'
            }
        },
        properties: {
            host: '@host@',
            processor: '#processor#'
        }
    }
};
```

This will do exactly the same as the previous example with `children`. The reference of type `@` use the context of the declination. For `computer.local`, `@host@` resolves in `'127.0.0.1'`.

So, when to use `children` and when to use `declinations`? `children` allows you to override each node of the parent whereas `declinations` only processes on the properties. However, `declinations` provides a simple way to make declinations of services from the configuration for instance:

```javascript
// config/server/this.js

'use strict';

module.exports = {
    computers: {
        local: {
            host: '127.0.0.1'
        },
        remote: {
            host: '192.168.0.1'
        }
    }
};
```

The associated contract for this config is not given here but remember that you have to define a corresponding one.

```javascript
// config/server/service.js

'use strict';

module.exports = {
    processor: {
        class: '%classes.processor%'
    },
    computer: {
        class: '%classes.computer%',
        declinations: '$computers$',
        properties: {
            host: '@host@',
            processor: '#processor#'
        }
    }
};
```

This will do exactly the same as the previous example, you just set the definition of the declinations in your configuration (instead than directly in the definition of the service) thanks to the reference `$computers$` of type `$` which use the config as its context. This allows, for example, to use the check mechanism of the contract on the definition of the declinations. Note that you cannot use `declinations` and `children` in the same definition.

**Note:**

> Remember that [references can be used in a concatenation mode](configuration.md). You might want to use a form like `host: '@host@:@port@'` to add a port for instance.

####Tags

You can tag your homogeneous services in order to inject all of them to another service:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    computer: {
        class: '%classes.computer%',
        tags: ['computer'],
        children: {
            local: {
                properties: {
                    host: '127.0.0.1'
                }
            },
            remote: {
                properties: {
                    host: '192.168.0.1'
                }
            }
        }
    },
    synchronizer: {
        class: '%classes.synchronizer%',
        properties: {
            computers: '&computer&'
        }
    }
};
```

The services `computer.local` and `computer.remote` are tagged with `computer`. These services are injected to the service `synchronizer` thanks to the reference `&computer&` of type `&` which use the tagged services as context. The node `tags` is an array, which means you can define many tags for a same service. The tags of a parent service are added to the children's ones. Let's see the implementation of the class of the service `synchronizer`:

```javascript
// lib/server/synchronizer.js

'use strict';

module.exports = Synchronizer;

function Synchronizer() {
}

Synchronizer.defineDependency('_computers', 'computer_array');

Object.defineProperty(Synchronizer.prototype, 'computers', {
    get: function() { return this._computers; },
    set: function(computers) { this._computers = computers; }
});

Synchronizer.prototype.compute = function() {
    // ...
}
```

`Synchronizer.defineDependency('_computers', 'computer_array');` means that the private property `_computers` should be an array of objects whom classes implement the interface `computer`.

####Factories

You can control the instantiation of a service injected into another. To do this, use the node `factories` and the references of type `>`:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    processor: {
        class: '%classes.processor%',
        factories: {
            computer: {
                properties: {
                    operations: '@operations@'
                }
            }
        }
    },
    computer: {
        class: '%classes.computer%',
        declinations: {
            local: {
                host: '127.0.0.1',
                operations: [1, 2]
            },
            remote: {
                host: '192.168.0.1',
                operations: [3]
            }
        },
        properties: {
            host: '@host@',
            processor: '>processor>computer>@@_@@>'
        }
    }
};
```

`>processor>computer>@@_@@>` is a reference to a factory. `>processor>...` means this will be a factory of the service `processor`. `...>computer>...` means this will use the factory of name `computer`. The last optional part `...>@@_@@>`, is the context that will be applied to the factory (like for `declinations`). Here, we took the root of the declinations. `{host: '127.0.0.1', operations: [1, 2]}` will be passed to the factory for the service `computer.local` for instance.

There is a double interpretation of the context. That's why you must use a double `@`. The first interpretation of `@@_@@` will lead to `@_@`, then the second to `{host: '127.0.0.1', operations: [1, 2]}`. This could be useful in the following case:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    processor: {
        class: '%classes.processor%',
        factories: {
            computer: {
                properties: {
                    operations: '@operations@'
                }
            }
        }
    },
    computer: {
        class: '%classes.computer%',
        declinations: {
            local: {
                host: '127.0.0.1',
                processors: {
                    cpu: {operations: [1, 2]},
                    gpu: {operations: [3]}
                }
            },
            remote: {
                host: '192.168.0.1',
                processors: {
                    cpu: {operations: [4]},
                    gpu: {operations: [3, 5]}
                }
            }
        },
        properties: {
            host: '@host@',
            processors: '>processor>computer>@@processors.@processors@@@>'
        }
    }
};
```

The first interpretation of `@@processors.@processors@@@` will lead to `[@processors.cpu@, @processors.gpu@]` that will induce the instantiation and injection of two services of type `processor` in the service `computer.local`. The first with the context {operations: [1, 2]} and the second with `{operations: [3]}`.

You can also use the references coming from the config (`$`).

####Alias

You can define aliases to refer to a service with a different name thanks to the node `alias`:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    computer: {
        class: '%classes.computer%',
        children: {
            local: {
                properties: {
                    host: '127.0.0.1'
                }
            },
            remote: {
                properties: {
                    host: '192.168.0.1'
                }
            }
        }
    },
    defaultComputer: {
        alias: 'computer.local'
    }
};
```

Obviously, you cannot use anything else than the node `alias` for the definition of an aliased service.

###Inject an instance of a class which is not a service

Of course, some of your classes are not instantiated as services (as data class for instance). The way to work with that kind of objects in Danf is to use providers:

```javascript
// config/server/service.js

'use strict';

module.exports = {
    operationProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: '%classes.operation%',
            interface: 'operation'
        }
    },
    processor: {
        class: '%classes.processor%',
        properties: {
            operationProvider: '#operationProvider#'
        }
    }
}
```

Here is the implementation of the class `%classes.operation%`:

```javascript
// lib/server/operation.js

'use strict';

module.exports = Operation;

function Operation() {
}

Operation.defineImplementedInterfaces(['operation']);

Object.defineProperty(Operation.prototype, 'opCode', {
    get: function() { return this._opCode; },
    set: function(opCode) { this._opCode = opCode; }
});
```

You can use the provider service like the following:

```javascript
// lib/server/processor.js

'use strict';

module.exports = Processor;

function Processor() {
}

Processor.defineImplementedInterfaces(['processor']);

Processor.defineDependency('_operationProvider', 'danf:dependencyInjection.provider', 'operation');

Object.defineProperty(Processor.prototype, 'operationProvider', {
    get: function() { return this._operationProvider; },
    set: function(operationProvider) { this._operationProvider = operationProvider; }
});

Processor.prototype.process = function() {
    var newOperation = this._operationProvider.provide();

    newOperation.opCode = '01001011';

    // ...
}
```

`Processor.defineDependency('_operationProvider', 'danf:dependencyInjection.provider', 'operation');` means that you use a provider of objects coming from a class implementing the interface `operation`. Remember that a service is shared between all the requests/users, so you should not use this to set a particular state in your services.

Navigation
----------

[Previous section](object.md) |
 [Next section](client-side.md)

[Application](../test/dependency-injection.md)

[←](index.md)
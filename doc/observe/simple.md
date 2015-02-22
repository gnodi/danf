Respond to a HTTP request with a server class processing
========================================================

[←](index.md)

A functional version of the code of this example can be found [here](../../test/functional/example/simple).

Example
-------

Here is an example of class:

```javascript
// uppercaser.js

'use strict';

/**
 * Expose `Uppercaser`.
 */
module.exports = Uppercaser;

// Definition of the constructor.
/**
 * Initialize a new uppercaser.
 */
function Uppercaser() {
}

// Definition of the implemented interfaces.
// Here, Uppercaser is implementing the interface "wordProcessor".
Uppercaser.defineImplementedInterfaces(['wordProcessor']);

// Implementation of the method of the interface.
/**
 * @interface {wordProcessor}
 */
Uppercaser.prototype.process = function(word) {
    return word.toUpperCase();
}
```

Here is an example of application using this class:

```javascript
// app.js

'use strict';

var danf = require('danf');

danf({
    config: {
        // Declaration of the class.
        classes: {
            uppercaser: require('./uppercaser')
        },
        // Definition of the interface implemented by this class.
        interfaces: {
            wordProcessor: {
                methods: {
                    process: {
                        arguments: ['string/word'],
                        returns: 'string'
                    }
                }
            }
        },
        // Definition of a service using this class.
        services: {
            uppercaser: {
                class: 'uppercaser'
            }
        },
        // Definition of a sequence using this service.
        sequences: {
            uppercaseName: [
                // Pass the field "name" of the input stream as first argument
                // to the method "process" of the service "uppercaser".
                {
                    service: 'uppercaser',
                    method: 'process',
                    arguments: ['@name@'],
                    returns: 'name'
                }
            ]
        },
        // Definition of an event of kind HTTP request using this sequence.
        events: {
            request: {
                hello: {
                    path: '/',
                    methods: ['get'],
                    // Description of expected input stream coming from requests.
                    parameters: {
                        name: {
                            type: 'string',
                            default: 'world'
                        }
                    },
                    // Definition of the used view.
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/hello.jade'
                            }
                        }
                    },
                    // Description of the executed sequences.
                    sequences: ['uppercaseName']
                }
            }
        }
    }
});
```

And here is the view:

```jade
//- hello.jade

h1
    = 'Hello ' + name + '!'
```

> Test it executing: `$ node app.js`

Navigation
----------

| [Use a class on both the client and server sides](client-server-class.md)

[←](index.md)
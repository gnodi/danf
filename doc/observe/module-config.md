Define your own danf module config
==================================

[←](index.md)

A functional version of the code of this example can be found [here](../../test/functional/example/module-config).

Example
-------

Here is an example of configuration defining some module config:

```javascript
// app.js

'use strict';

var danf = require('danf');

danf({
    // Define the contract that the config of your danf module must respect.
    contract: {
        helloMessage: {
            type: 'string',
            default: 'world'
        }
    },
    config: {
        // Define your config.
        this: {
            helloMessage: 'everybody'
        },
        sequences: {
            getHelloMessage: [
                {
                    // Danf's service allowing to execute a callback.
                    // Just use it for tests.
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(message) {
                            return message;
                        },
                        // Inject the config field "helloMessage".
                        // You can use this to do the same in a property of a service.
                        '$helloMessage$'
                    ],
                    returns: 'message'
                }
            ]
        },
        events: {
            request: {
                hello: {
                    path: '/',
                    methods: ['get'],
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/hello.jade'
                            }
                        }
                    },
                    sequences: ['getHelloMessage']
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
    = 'Hello ' + message + '!'
```

> Test it executing: `$ node app.js`

Navigation
----------

[Inject services into each others](dependency-injection.md) |
 [Override and use the config of a danf module dependency](dependency-config-override.md)

[←](index.md)
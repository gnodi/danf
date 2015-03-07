![Danf](img/small-logo.jpg)
===========================

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][versioneye-image]][versioneye-url]

Introduction
------------

### Another javascript/node.js framework??

Yes!

### Why?

The main goal of this full-stack framework is to help you organize, rationalize and homogenize your javascript code (website, api, ...) on both server-side (node.js) and client-side (browser).

### Which features of this framework can help me to fulfill this goal?

Danf provides several features in order to produce a scalable, maintainable, testable and performant code:
* An object-oriented programming layer (formal classes, easy inheritance, ensured interfaces).
* An inversion of control design (dependency injection via configuration files).
* A simple system allowing to use the same code on both client-side and server-side.
* A homogeneous way to handle all kind of events (HTTP requests, DOM events, ...).
* An elegant solution to callback hell preserving asynchronicity.
* A helper to develop performant ajax applications supporting deep linking.
* A modular approach to develop and use (open source) modules.
* Some other helpful sub features to easily manage cookies, session, ...

### What?? An object-oriented programming layer?

Object-oriented programming (OOP) is often a controversial topic in the javascript community. Most of the time, you can observe two reactions:
* - But everything is already object in javascript!
* - Why the hell do you want to use OOP in javascript?

First, that is not because all variables are objects that a langage can be considered as providing a way to make a straightforward and robust OOP. As for now, native javascript does not allow to make a reliable industrial OOP code (the reasons are explained in the [concepts](resource/private/doc/concepts.md) section of the documentation).
Then, OOP is certainly not a matter of language, but rather a means of architecturing applications. So why not use OOP for a javascript application?

Hello world
-----------

```javascript
// app.js

var danf = require('danf');

danf({
    config: {
        events: {
            request: {
                helloWorld: {
                    path: '/',
                    methods: ['get'],
                    view: {
                        text: {
                            value: 'Hello world!'
                        }
                    }
                }
            }
        }
    }
});
```

Installation
------------

```sh
$ npm install -g danf
```

A better way to start a new application with Danf is to use the available [proto application](https://github.com/gnodi/danf-proto-app).

Community
---------

Danf is a brand new framework. It can help you to master big projects by avoiding the divergence of the complexity as well as smaller fast and dynamic websites. Just give it a try on one of your project or by testing the [tutorial](resource/private/doc/test/index.md). Be careful, you could see your way of coding javascript in node.js forever change (or not...).

The community is still small, but it is an active community. You can post your issues on [github](https://github.com/gnodi/danf/issues) or on [stack overflow](http://stackoverflow.com/) with the tag `danf` and you will get an answer as quickly as possible.

> `<trailer-voice>`Have you ever wanted to participate in the early stages of a new technology? Let's try it on Danf! Join the community and contribute now.`</trailer-voice>`

You have several ways to contribute:

* Fork the project on [github](https://github.com/gnodi/danf) and improve framework's features, documentation, ...
* Code your own module. In Danf, all your code is always automatically part of a **danf module**. This way you can easily share your modules with other people using npm. You can find a list of existing **danf modules** [here](resource/private/doc/modules.md).
* Star the project to encourage its development.
* Participate to the community in asking questions in the issues or on stack overflow.

Code examples
-------------

### Respond to a HTTP request with a server class processing

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

danf(
    // Define danf module configuration.
    {
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
    },
    // Define server context.
    {
        environment: 'prod',
        debug: false
    },
    // Define client context.
    {
        environment: 'prod',
        debug: false
    }
);
```

And here is the view:

```jade
//- hello.jade

h1
  = 'Hello ' + name + '!'
```

> Test it executing: `$ node app.js`

Find the full example [here](resource/private/doc/observe/simple.md)!

### Use a class on both client-side and server-side

Here is a class both usable in the browser and in node.js:

```javascript
// logger.js

'use strict';

// Define "define" for the client or the server.
var define = define ? define : require('amdefine')(module);

// Wrapper allowing to use the class on both client-side and server-side.
define(function(require) {
    /**
     * Initialize a new logger.
     */
    function Logger() {}

    Logger.defineImplementedInterfaces(['logger']);

    /**
     * @interface {logger}
     */
    Logger.prototype.log = function(message) {
        console.log(message);
    }

    /**
     * Expose `Logger`.
     */
    return Logger;
});
```

Find the full example [here](resource/private/doc/observe/client-server-class.md)!

### Inject services into each others

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
                // You can see how inheritance works in the full example accessible in the link below.
                abstract: require('./abstract-processor'),
                adder: require('./adder'),
                multiplier: require('./multiplier')
            },
            parser: require('./parser'),
            computer: require('./computer')
        },
        // ...
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
        // ...
    }
});
```

Find the full example [here](resource/private/doc/observe/dependency-injection.md)!

### Define your own danf module config

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
        // ...
    }
});
```

Find the full example [here](resource/private/doc/observe/module-config.md)!

### Override and use the config of a danf module dependency

Here is the configuration of a danf module that will be used as a dependency by another one:

```javascript
// node_modules/form/danf.js

'use strict';

module.exports = {
    contract: {
        form: {
            type: 'embedded_object',
            embed: {
                labels: {
                    type: 'string_object'
                }
            }
        }
    },
    config: {
        this: {
            form: {
                login: {
                    labels: {
                        login: 'Login',
                        password: 'Password'
                    }
                }
            }
        },
        sequences: {
            getLoginLabels: [
                // ...
            ]
        }
    }
};
```

Here is the configuration of the main danf module using this dependency:

```javascript
'use strict';

var danf = require('danf');

danf({
    // Define a dependency "form" referencing its danf configuration file.
    dependencies: {
        form: require('form/danf')
    },
    config: {
        // Override the default config of dependency "form".
        // This will result in:
        // form.login.labels = {login: 'Username', password: 'Password'}
        form: {
            form: {
                login: {
                    labels: {
                        login: 'Username'
                    }
                }
            }
        },
        sequences: {
            // Override the sequence "getLoginLabels" of dependency "form".
            // You can do the same for any classes, services, interfaces, ...
            'form:getLoginLabels': [
                {
                    // Danf's service allowing to execute a callback.
                    // Just use it for tests.
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(labels) {
                            return labels;
                        },
                        // Inject the config field "form.login.labels" of
                        // dependency "form".
                        '$form:form.login.labels$'
                    ],
                    returns: 'form.labels'
                }
            ]
        },
        // ...
    }
});
```

Find the full example [here](resource/private/doc/observe/dependency-config-override.md)!

Documentation
-------------

Learn more about the framework in the [documentation](resource/private/doc/index.md).

License
-------

Open Source Initiative OSI - The MIT License

http://www.opensource.org/licenses/mit-license.php

Copyright (c) 2014 Thomas Prelot

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-image]: https://img.shields.io/npm/v/danf.svg?style=flat
[npm-url]: https://npmjs.org/package/danf
[downloads-image]: https://img.shields.io/npm/dm/danf.svg?style=flat
[downloads-url]: https://npmjs.org/package/danf
[travis-image]: https://img.shields.io/travis/gnodi/danf.svg?style=flat
[travis-url]: https://travis-ci.org/gnodi/danf
[versioneye-image]:https://www.versioneye.com/user/projects/54da27f8c1bbbd5f8200020a/badge.svg?style=flat
[versioneye-url]:https://www.versioneye.com/user/projects/54da27f8c1bbbd5f8200020a
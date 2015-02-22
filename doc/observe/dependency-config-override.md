Override and use the config of a danf module dependency
=======================================================

[←](index.md)

A functional version of the code of this example can be found [here](../../test/functional/example/dependency-config-override).

Example
-------

Here is the code of a danf module that will be used as a dependency by another one:

```javascript
// node_modules/form/app.js

'use strict';

var danf = require('danf');

// A danf module can be an executable application too.
// If you want your module to be useable by others, you should
// define your danf configuration in another file like in this
// example.
danf(require('./danf'));
```

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
                {
                    // Danf's service allowing to execute a callback.
                    // Just use it for tests.
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(form) {
                            if (form.login) {
                                return form.login.labels;
                            }

                            return {
                                login: 'login',
                                password: 'password'
                            }
                        },
                        '$form$'
                    ],
                    returns: 'labels'
                }
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
        events: {
            request: {
                index: {
                    path: '/',
                    methods: ['get'],
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/index.jade'
                            }
                        }
                    },
                    // Use the sequence "getLoginLabels" of dependency "form".
                    sequences: ['form:getLoginLabels']
                }
            }
        }
    }
});
```

And here is the view:

```jade
//- hello.jade

form
    label(for='login')
        = form.labels.login
    input(type='text', name='login')

    label(for='password')
        = form.labels.password
    input(type='text', name='password')
```

> Test it executing: `$ node app.js`

Navigation
----------

[Define your own danf module config](module-config.md) |

[←](index.md)
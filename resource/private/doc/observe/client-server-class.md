Use a class on both the client and server sides
===============================================

[←](index.md)

A functional version of the code of this example can be found [here](../../test/functional/example/client-server-class).

Example
-------

Here is a class both usable in the browser and in node.js:

```javascript
// logger.js

'use strict';

// Define "define" for the client or the server.
var define = define ? define : require('amdefine')(module);

// Wrapper allowing to use the class on both the client and server sides.
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

Here is the app file:

```javascript
// app.js

'use strict';

var danf = require('danf');

danf(require('./danf'));
```

Here is the danf server configuration entry file:

```javascript
// danf.js

'use strict';

var utils = require('-/danf/lib/utils');

module.exports = {
    config: utils.merge(
        // Merge common and server config.
        require('./common-config'),
        require('./server-config'),
        true
    )
};
```

Here is the danf client configuration entry file:

```javascript
// danf-client.js

'use strict';

define(function(require) {
    var utils = require('-/danf/utils');

    return {
        // Merge common and client config.
        config: utils.merge(
            require('my-app/common-config'),
            require('my-app/client-config'),
            true
        )
    };
});
```

Here is the server config file:

```javascript
// server-config.js

'use strict';

module.exports = {
    // The assets are the rules defining which files are accessible from HTTP requests.
    assets: {
        // Define the path for "danf-client".
        // You always need to define this path.
        'danf-client': __dirname + '/danf-client',
        // Map "my-app" to the current directory.
        // The URL path "/my-app/client-config" will give the file "client-config.js".
        'my-app': __dirname,
        // Forbid access to the file "server-config".
        '!my-app/server-config': __dirname + '/server-config.js'
    },
    // The definition of the classes is a little bit different for the client and the server.
    classes: {
        logger: require('./logger')
    },
    // Log on the HTTP request of path "/".
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
                sequences: ['logDanf']
            }
        }
    }
};
```

Here is the client config file:

```javascript
// client-config.js

'use strict';

define(function(require) {
    return {
        classes: {
            // You must use "my-app/logger" on the client side.
            // "my-app" is the name you defined in the assets of your server config.
            logger: require('my-app/logger')
        },
        // Log on the DOM ready event.
        events: {
            dom: {
                ready: {
                    event: 'ready',
                    sequences: ['logDanf']
                }
            }
        }
    }
});
```

Here is the common config file:

```javascript
// common-config.js

'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
        interfaces: {
            logger: {
                methods: {
                    log: {
                        arguments: ['string/message']
                    }
                }
            }
        },
        services: {
            logger: {
                class: 'logger'
            }
        },
        sequences: {
            logDanf: [
                {
                    service: 'logger',
                    method: 'log',
                    arguments: ['Powered by Danf']
                }
            ]
        }
    }
});
```

Finally, here is the view:

```jade
//- index.jade

h1 Take a look at your console!
```

> Test it executing: `$ node app.js`

How to organise all this code? Use the available [proto application](https://github.com/gnodi/danf-proto-app) to help you start a new danf module!

Navigation
----------

[Respond to a HTTP request with a server class processing](simple.md) |
 [Inject services into each others](dependency-injection.md)

[←](index.md)
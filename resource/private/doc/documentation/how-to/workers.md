How to Use Many Workers
=======================

[←](../index.md)

In Danf, setting workers to use the full potentiality of your processor is just one parameter of the context:

```javascript
// app-prod.js

'use strict';

var danf = require('danf'),
    app = danf(
        __dirname + '/danf-server.js',
        __dirname + '/danf-client.js',
        {
            environment: 'prod',
            debug: false,
            verbosity: 1,
            secret: 'abc123',
            workers: 2 // <------------------
        },
        {
            environment: 'prod',
            debug: false,
            verbosity: 1
        }
    )
;
```

This will launch the server application on 2 cores.

You can also specify a negative number which means: `max core number - my number`.
* `-1` is equivalent to all the CPU cores but one.
* `0` is equivalent to all the CPU cores.
* `1` is equivalent to one of the CPU cores.
* `undefined` is equivalent to one of the CPU cores.

[←](../index.md)
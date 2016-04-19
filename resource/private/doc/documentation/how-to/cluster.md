How to Configure the Cluster
============================

[←](../index.md)

In Danf, setting workers to use the full potentiality of your processor for your own application is just a matter of configuration:

```javascript
// app-prod.js

'use strict';

module.exports = {
    server: {
        configuration: 'auto',
        context: {
            environment: 'prod',
            debug: false,
            verbosity: 1,
            cluster: [
                {
                    listen: ['http', 'socket'],
                    port: 3080,
                    workers: 3
                },
                {
                    listen: 'command',
                    port: 3111,
                    workers: 1
                }
            ]
        }
    },
    client: {
        configuration: 'auto',
        context: {
            environment: 'prod',
            debug: false,
            verbosity: 1,
            secret: 'test'
        }
    }
};
```

This will spawn a worker listening on input commands on port 3111 and 3 workers listening on HTTP requests and socket messages on port 3080.

You can also specify a negative number which means: `max core number - my number`.
* `-1` is equivalent to all the host CPU cores but one.
* `0` is equivalent to all the host CPU cores.
* `1` is equivalent to one of the host CPU cores.

[←](../index.md)
Start a New Application
=======================

[←](index.md)

Documentation
-------------

###Use a proto application

The easiest way to start a new Danf application is to download the zip of a proto application at https://github.com/gnodi/danf-proto-app and unzip the archive to your working directory.

Then, install dependencies:
```sh
$ npm install
```

You can launch the server to test your installation:
```sh
$ node app-dev
```

You should see `Hi!` at `http://localhost:3080` following by this instruction:
`Replace "my-app" in all files by the name of your application.`. Do it.

###Customize the context of the application

At the creation of the application, a context object can be passed to modify the execution.

####Environment

You can specify the environment and debug mode like this:

```javascript
// app-prod.js

'use strict';

var danf = require('danf'),
    app = danf(
        require(__dirname + '/danf'),
        {
            environment: 'prod',
            debug: false
        },
        {
            environment: 'prod',
            debug: false
        }
    )
;
```

The first context is for the server and the second for the client.

####Workers

In Danf, setting workers to use the full potentiality of your processor is just one parameter of the context:

```javascript
// app.js

'use strict';

var danf = require('danf'),
    app = danf(
        require(__dirname + '/danf'),
        {
            workers: 2
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

####Secret

You should define a complex secret to use as salt for encoding some of your application values.

```javascript
// app.js

'use strict';

var danf = require('danf'),
    app = danf(
        require(__dirname + '/danf'),
        {
            secret: 'ae56dezi6k7evb3'
        }
    )
;
```

Navigation
----------

[Next section](configuration.md)

[Application](../test/app.md)

[←](index.md)
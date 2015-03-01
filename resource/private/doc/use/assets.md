Handle Assets
=============

[←](index.md)

Documentation
-------------

Assets are the files (js, css, pdf, ...) that are accessible to an HTTP client (like a browser for example).
Danf provides a simple way to define these accessible files and directories. It is an important section because it could lead to critical security issues like exposing private content to users.

In the proto application a standard configuration should protect you from this risk if you place your files at the good place of course!

Let's explain this standard configuration as an example:

```javascript
// danf.js

'use strict';

var utils = require('danf/lib/utils');

module.exports = {
    // ...
    config: {
        assets: utils.merge(
            {
                'danf-client': __dirname + '/danf-client',
                'tutorial/config': __dirname + '/config',
                '!tutorial/config/server': __dirname + '/config/server',
                'tutorial/lib': __dirname + '/lib',
                '!tutorial/lib/server': __dirname + '/lib/server',
                'tutorial/public': __dirname + '/resources/public',
                '!tutorial/private': __dirname + '/resources/private',
                'favicon.png': __dirname + '/favicon.png'
            },
            require('./config/server/assets'),
            true
        ),
        // ...
    }
};
```

All the files in `config` are accessible excepts those in `config/server` for example.
* `'!tutorial/config/server': __dirname + '/config/server'` means that the files in the defined directory will not be accessible.
* `'tutorial/config': __dirname + '/config'` means that the files in the defined directory will be accessible.

The file `/resources/public/css/style.css` will be accessible using the path `tutorial/public/css/style.css`.
The file `/resources/private/css/style.css` will not be accessible.

The rules can apply on both directories and files.
`'danf-client': __dirname + '/danf-client'` is an example of use on a file. By default, the extension is `.js`. you must specify it if you want to make a rule on another type of file.

The algorithm is simple:
*1. If the asked file is matched by a forbidden rule, the file will not be served (404).
*2. Else if the asked file is matched by an allowed rule, the file will be served if it exists (otherwise 404).
*3. Else (the asked file is not matched by any rule), the file will not be served (404) (anyway it cannot be mapped to a path).

It is important to note that the name of your application (here `tutorial`) should be unique because you could have naming collisions between danf modules (using the name of your npm package for public danf modules seems to be a good practice). For obvious (or not?) reasons, it is not possible to prefix these rules with the namespace of a module. If you use many versions of a same danf module, you should really consider redefining its rules in the config of your application to disambiguate which ones will be used.

Navigation
----------

[Previous section](events.md) |
 [Next section](ajax-app.md)

[Application](../test/assets.md)

[←](index.md)
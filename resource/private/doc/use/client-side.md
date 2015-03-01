Extend to the Client Side
=========================

[←](index.md)

Documentation
-------------

### Define a class for the client side

Defining a class for the client side is almost the same as for the server. You just have to define your class in a [Requirejs](http://requirejs.org/docs/node.html) wrapper.

```javascript
// lib/client/computer.js

'use strict';

define(function(require) {
    // Constructor.
    function Computer() {
    }

    // Property.
    Object.defineProperty(Computer.prototype, 'host', {
        get: function() { return this._host; },
        set: function(host) { this._host = host; }
    });

    // Method.
    Computer.prototype.compute = function() {
        // ...
    }

    // Replace the module.exports.
    return Computer;
});
```

Here is the declaration of the class:

```javascript
// config/client/classes.js

'use strict';

define(function(require) {
    return {
        computer: require('my-app/lib/client/computer')
    };
});
```

Where `my-app` is your application name.

### Define a class for both the client and server sides

In some cases, you would like to use a class on both the client and server sides. As for the client side, you need a little wrapper:

```javascript
// lib/common/computer.js

'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    // Constructor.
    function Computer() {
    }

    // Property.
    Object.defineProperty(Computer.prototype, 'host', {
        get: function() { return this._host; },
        set: function(host) { this._host = host; }
    });

    // Method.
    Computer.prototype.compute = function() {
        // ...
    }

    // Replace the module.exports.
    return Computer;
});
```

The only addition is `var define = define ? define : require('amdefine')(module);` which allows the class to be compatible for both sides.
You then need to declare the class for the server:

```javascript
// config/server/classes.js

'use strict';

module.exports = {
    computer: require('../../lib/common/computer')
};
```

and the client:

```javascript
// config/client/classes.js

'use strict';

define(function(require) {
    return {
        computer: require('my-app/lib/common/computer')
    };
});
```

### Define the config

If you use this pattern, the rest of the config does not need to be defined twice. You have to use the corresponding previous wrappers in your config files if you want to use them on the client or on both sides.

In the proto application,
* the server config is defined in the files of the directory `config/server`,
* the client config is defined in the files of the directory `config/client`,
* the common config is defined in the files of the directory `config`.

Navigation
----------

[Previous section](dependency-injection.md) |
 [Next section](events.md)

[Application](../test/client-side.md)

[←](index.md)
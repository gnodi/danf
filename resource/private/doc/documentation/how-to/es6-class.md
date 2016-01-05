How to Use ES6 Class Syntaxic Sugar
===================================

It is possible to [use ES6 class syntaxic sugar](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes).

Example
-------

Take a simple ES5 class declaration:

```javascript
// lib/server/computer.js

'use strict';

module.exports = Computer;

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
```

Here is its ES6 counterpart:

```javascript
// lib/server/computer.js

'use strict';

class Computer {
    // Constructor (not useful here, can be omitted).
    constructor() {
    }

    // Property.
    get host() {
        return this._host;
    }

    set host(host) {
        if (host) {
            this._host = host;
        }
    }

    // Method.
    compute() {
        // ...
    }
}

module.exports = Computer;
```

> Note that the keyword `class` is only accessible in strict mode for node.js.

> `module.exports = Computer;` is defined at the end of the file because class declarations are not hoisted as function declarations.

Inheritance
-----------

If you want to use danf dynamic inheritance with ES6 class syntaxic sugar, you can replace:

```javascript
function Computer() {
}

Computer.defineExtendedClass('abstractComputer');
```

with:

```javascript
class Computer extends Function.getReference('abstractComputer') {
```

> Thanks to `Function.getReference()`, Danf is able to handle all the modular import/require logic for you.

Compatibility
-------------

Be aware that, as of today, this syntax is not implemented in all [browsers](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Browser_compatibility) and is not usable in all [node.js version](https://github.com/nodejs/node/blob/master/CHANGELOG.md).
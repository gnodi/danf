Testing
=======

[←](../index.md)

Documentation
-------------

### Use the helper

Danf provides an helper allowing you to easily test your classes and services.

Take an example:

```javascript
// lib/server/abstract-computer.js

'use strict';

module.exports = AbstractComputer;

function AbstractComputer() {
}

AbstractComputer.prototype.compute = function() {
    return this.value * 2;
}
```

```javascript
// lib/server/computer.js

'use strict';

module.exports = Computer;

function Computer() {
    this.value = 3;
}

Computer.defineExtendedClass('abstractComputer');

Object.defineProperty(Computer.prototype, 'value', {
    get: function() { return this._value; },
    set: function(value) { this._value = value; }
});
```

```javascript
// config/server/config/services.js

'use strict';

module.exports = {
    computer: {
        class: 'computer',
        properties: {
            value: 4
        }
    }
};
```

You can retrieve an instance of the `TestHelper` class like this:

```javascript
// test/unit/computer.js

'use strict';

var TestHelper = require('-/danf/lib/test/test-helper'),
    configuration = require('../../danf-server'),
    testHelper = new TestHelper(configuration)
;
```

This `testHelper` then allows you to:

* Retrieve a class:
```javascript
    var class_ = testHelper.getClass('computer');
```

* Retrieve an instance of a class:
```javascript
    var computer = testHelper.getInstance('computer');
```

* Retrieve a service:
```javascript
    var computer = testHelper.getService('computer');
```

* Retrieve the current app:
```javascript
    var app = testHelper.getApp();
```

In most cases you will use `testHelper.getInstance('...')` because you want to test an isolated instance of your class (mock dependencies). In some cases, however, you might want to retrieve a service in order to make "more functional" tests.

### Make tests

[Mocha](https://github.com/mochajs/mocha) and [Supertest](https://github.com/tj/supertest) are integrated by default in the proto application to help you quickly implement and execute your tests.

Let's test the previous example with mocha:

```javascript
// test/unit/computer.js

'use strict';

var assert = require('assert'),
    TestHelper = require('-/danf/lib/test/test-helper'),
    configuration = require('../../danf-server'),
    testHelper = new TestHelper(configuration)
;

describe('Computer', function() {
    // Test the class.
    it('should compute correctly', function() {
        var computer = testHelper.getInstance('computer')

        assert.equal(computer.compute(), 6);
    })

    // Test the service.
    it('should compute correctly', function() {
        var computer = testHelper.getService('computer')

        assert.equal(computer.compute(), 8);
    })
})
```

See the [Mocha](https://github.com/mochajs/mocha) and [Supertest](https://github.com/tj/supertest) documentation for more informations.

### Execute tests

To execute your tests, simply use the command:

```sh
$ make test
```

Navigation
----------

[< Ajax App](ajax-app.md) |

[←](../index.md)

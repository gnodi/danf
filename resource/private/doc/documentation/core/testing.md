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

AbstractComputer.prototype.computeAsync = function() {
    this.__asyncProcess(function(async) {
        // Simulate an asynchronous computing.
        setTimeout(
            async(function() {
                return this.value * 3;
            }),
            10
        );
    });
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

You can use a test helper like this:

```javascript
// test/unit/computer.js

'use strict';

var assert = require('assert'),
    TestHelper = require('danf/lib/server/test/test-helper')
;

TestHelper.use(null, null, function(helper) {
    // TODO: implement your tests here.
});
```

This `helper` then allows you to:

* Retrieve a class:
```javascript
    var class_ = helper.getClass('computer');
```

* Retrieve an instance of a class:
```javascript
    var computer = helper.getInstance('computer');
```

* Retrieve a service:
```javascript
    var computer = helper.getService('computer');
```

* Retrieve the current app:
```javascript
    var app = helper.getApp();
```

In most cases you will use `helper.getInstance('...')` because you want to test an isolated instance of your class (mock dependencies). In some cases, however, you might want to retrieve a service in order to make "more functional" tests.

### Make tests

[Mocha](https://github.com/mochajs/mocha) and [Supertest](https://github.com/tj/supertest) are integrated by default in the proto application to help you quickly implement and execute your tests.

Let's test the previous example with mocha:

```javascript
// test/unit/computer.js

'use strict';

var assert = require('assert'),
    TestHelper = require('danf/lib/server/test/test-helper')
;

TestHelper.use(null, null, function(helper) {
    describe('Computer', function() {
        // Test the class.
        it('should compute correctly', function() {
            var computer = testHelper.getInstance('computer')

            assert.equal(computer.compute(), 6);
        })

        // Test a synchronous process of the service.
        it('should compute correctly', function() {
            var computer = testHelper.getService('computer');

            assert.equal(computer.compute(), 8);
        })

        // Test an asynchronous process of the service.
        it('should compute correctly even asynchronously', function() {
            var computer = testHelper.getService('computer');

            test.testAsync(
                function() {
                    computer.computeAsync();
                },
                function(error, result) {
                    assert.equal(result, 24);

                    done();
                }
            );
        })
    })
});
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

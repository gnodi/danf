Code Unit Tests
===============

[←](index.md)

Application
-----------

Unit testing is essential to have a robust code and to detect regressions. Mocha and supertest are integrated by default in the proto application to help you handle this problematic.

Here is an example of test on the `categoryComputer.dumb` class:

```javascript
// test/unit/category-computer/dumb.js

'use strict';

var assert = require('assert'),
    TestHelper = require('danf/lib/test/test-helper'),
    configuration = require('../../../danf'),
    testHelper = new TestHelper(configuration),
    // Retrieve an instance of the class dumb.
    dumb = testHelper.getInstance('categoryComputer.dumb'),
    // Mock dependencies.
    sequencer = testHelper.getInstance('danf:manipulation.sequencer'),
    sequencerProvider = {
        provide: function() {
            return sequencer;
        }
    },
    benchmarker = {
        start: function() {},
        end: function() {}
    }
;

// Inject dependencies.
dumb.boost = 2;
dumb.scoresDirectory = __dirname + '/../../fixtures/questions-scores';
dumb.questions = {
    q1: 1, // danf: 4, other: 2
    q2: 2, // danf: 7, other: 1
    q3: 3  // danf: 3, other: 0
};
dumb.sequencerProvider = sequencerProvider;
dumb.benchmarker = benchmarker;

// Pipe the computing in the sequencer.
sequencer.pipe(
    function() {
        var result = dumb.compute(
            'danf',
            {
                q1: false,
                q2: true,
                q3: true
            }
        );

        return function(stream) {
            stream['danf'] = result;

            return stream;
        };
    }
);
sequencer.pipe(
    function() {
        var result = dumb.compute(
            'other',
            {
                q1: false,
                q2: true,
                q3: true
            }
        );

        return function(stream) {
            stream['other'] = result;

            return stream;
        };
    }
);

describe('Dumb category computer', function() {
    it('should compute framework scores correctly', function(done) {
        // Execute the sequence.
        sequencer.start({}, function(stream) {
            assert.deepEqual(
                stream,
                {
                    danf: 12, // 7[q2] + 3[q3] - 4[q1] + (2 * 3)[computed boost]
                    other: 5  // 1[q2] + 0[q3] - 2[q1] + (2 * 3)[computed boost]
                }
            );

            done();
        });
    })
})
```

There is 2 things to note here:
* Danf provides an helper `var TestHelper = require('-/danf/lib/test/test-helper');` allowing to retrieve an instance of the tested class with builded inheritance `dumb = testHelper.getInstance('categoryComputer.dumb')`.
* It is not the only way but you can see an example of how to test a class with heavy asynchronicity.

To make this test works, do not forget the following fixtures:

* `test/fixtures/questions-scores/q1.csv`
```javascript
danf:4
other:2
```

* `test/fixtures/questions-scores/q2.csv`
```javascript
danf:7
other:1
```

* `test/fixtures/questions-scores/q3.csv`
```javascript
danf:3
other:0
```

To execute this test, just use the command `$ make test`.

This is the end of the test application. Hope you enjoyed to discover the framework with this little example.
To deeper your understanding of the framework, let's have a look on the [documentation](../use/index.md) section!
The code of this tutorial is available [here](../../test/functional/proto/tutorial).

Navigation
----------

[Previous section](ajax-app.md)

[Documentation](../use/tests.md)

[←](index.md)
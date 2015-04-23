'use strict';

var assert = require('assert'),
    TestHelper = require('danf/lib/server/test/test-helper'),
    configuration = require('../../../danf-server'),
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
dumb.scoresDirectory = __dirname + '/../../fixture/questions-scores';
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
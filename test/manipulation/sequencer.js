'use strict';

require('../../lib/init');

var assert = require('assert'),
    Sequencer = require('../../lib/manipulation/sequencer')
;

var sequencer = new Sequencer();

describe('Sequencer', function() {
    it('should process an asynchrone sequence of callbacks', function(done) {
        sequencer.pipe(function() {
            return function(stream) {
                return stream * 2;
            }
        });

        sequencer.pipe(function(stream) {
            var firstTask = sequencer.wait();

            setTimeout(
                function() {
                    sequencer.end(firstTask, function (stream) {
                        return stream + 2;
                    });
                },
                100
            );

            var secondTask = sequencer.wait();

            setTimeout(
                function() {
                    sequencer.end(secondTask, function (stream) {
                        return stream + 3;
                    });
                },
                10
            );

            return function(stream) {
                return stream - 1;
            }
        });

        sequencer.pipe(function() {
            return function(stream) {
                return stream * 3;
            }
        });

        sequencer.start(2, function(stream) {
            assert.equal(stream, 24);

            done();
        });
    })

    it('should allow easy sub sequencer piping', function(done) {
        var subSequencer = new Sequencer();
        subSequencer.__metadata = {
            implements: ['danf:manipulation.sequencer']
        };

        subSequencer.pipe(function() {
            return function(stream) {
                return stream / 2;
            }
        });

        sequencer.pipe(subSequencer);

        sequencer.start(3, function(stream) {
            assert.equal(stream, 15);

            done();
        });
    })

    it('should allow to process 2 streams at the same time', function(done) {
        sequencer.start(2, function(stream) {
            assert.equal(stream, 12);
        });

        sequencer.start(3, function(stream) {
            assert.equal(stream, 15);

            done();
        });
    })

    it('should fail to end a not started task', function() {
        assert.throws(
            function() {
                sequencer.end(1000);
            },
            /The task "1000" has not been started./
        );
    })

    describe('should allow to process pass a context for', function() {
        var contextSequencer = new Sequencer(),
            a = 1
        ;

        contextSequencer.pipe(function(stream) {
            return function() {
                return a;
            };
        });

        it('all processed stream', function(done) {
            contextSequencer.addGlobalContext(function() {
                a = 2;
            });

            contextSequencer.start(a, function(stream) {
                assert.equal(stream, 2);

                done();
            });
        })

        it('one particular stream', function(done) {
            a = 1;

            contextSequencer.start(
                a,
                function(stream) {
                    assert.equal(stream, 3);

                    done();
                },
                function() {
                    a = 3;
                }
            );
        })
    })
})
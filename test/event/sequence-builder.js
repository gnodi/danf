'use strict';

require('../../lib/init');

var assert = require('assert'),
    SequenceBuilder = require('../../lib/event/sequence-builder'),
    Sequencer = require('../../lib/manipulation/sequencer'),
    ReferenceResolver = require('../../lib/manipulation/reference-resolver'),
    ReferenceType = require('../../lib/manipulation/reference-type')
;

var referenceResolver = new ReferenceResolver(),
    contextReferenceType = new ReferenceType(),
    configurationReferenceType = new ReferenceType(),
    sequenceBuilder = new SequenceBuilder()
;

contextReferenceType.name = '@';
contextReferenceType.delimiter = '@';

configurationReferenceType.name = '$';
configurationReferenceType.delimiter = '$';

referenceResolver.addReferenceType(contextReferenceType);
referenceResolver.addReferenceType(configurationReferenceType);

var services = {
        counter: {
            inc: function(value, inc) {
                return value + inc;
            },
            dec: function(value, dec) {
                return value - dec;
            }
        },
        scheduler: {
            start: function (value, inc, timeout) {
                var sequencer = currentSequencerProvider.provide();

                var firstInc = sequencer.wait();

                setTimeout(
                    function() {
                        sequencer.end(firstInc, function(value) {
                            return value + inc;
                        });
                    },
                    timeout + 20
                );

                var secondInc = sequencer.wait();

                setTimeout(
                    function() {
                        sequencer.end(secondInc, function(value) {
                            return value + inc;
                        });
                    },
                    timeout
                );

                return value + inc;
            }

        }
    },
    servicesContainer = {
        get: function(id) {
            return services[id];
        }
    },
    newSequencerProvider = {
        provide: function() {
            return new Sequencer();
        }
    },
    currentSequencerProvider = {
        provide: function() {
            return currentSequencerProvider.sequencer;
        },
        set: function(sequencer) {
            currentSequencerProvider.sequencer = sequencer;
        },
        unset: function() {
            delete currentSequencerProvider.sequencer;
        }
    }
;

sequenceBuilder.servicesContainer = servicesContainer;
sequenceBuilder.referenceResolver = referenceResolver;
sequenceBuilder.newSequencerProvider = newSequencerProvider;
sequenceBuilder.currentSequencerProvider = currentSequencerProvider;

describe('SequenceBuilder', function() {
    describe('method "build"', function() {
        it('should build a sequence and return the corresponding sequencer', function(done) {
            var sequencer = sequenceBuilder.build(
                    'foo',
                    [
                        {
                            service: 'counter',
                            method: 'inc',
                            arguments: ['@i@', 5],
                            returns: 'i'
                        },
                        {
                            service: 'counter',
                            method: 'dec',
                            arguments: ['@i@', 2],
                            returns: 'i'
                        }
                    ]
                )
            ;

            sequencer.start({i: 4}, function(stream) {
                assert.equal(stream.i, 7);

                done();
            });
        })

        it('should build a conditionnal sequence if the parameter condition is defined', function(done) {
            var sequences = [
                    {
                        service: 'counter',
                        method: 'inc',
                        arguments: ['@i@', 5],
                        returns: 'i'
                    },
                    {
                        condition: function(parameters) {
                            return parameters.i < 10;
                        },
                        service: 'counter',
                        method: 'dec',
                        arguments: ['@i@', 2],
                        returns: 'i'
                    }
                ],
                sequencer = sequenceBuilder.build(
                    'bar',
                    sequences
                )
            ;

            sequencer.start({i: 3}, function(stream) {
                assert.equal(stream.i, 6);

                done();
            });
        })

        it('should build a conditionnal sequence if the parameter condition is defined', function(done) {
            var sequences = [
                    {
                        service: 'counter',
                        method: 'inc',
                        arguments: ['@i@', 5],
                        returns: 'i'
                    },
                    {
                        condition: function(parameters) {
                            return parameters.i > 10;
                        },
                        service: 'counter',
                        method: 'dec',
                        arguments: ['@i@', 2],
                        returns: 'i'
                    }
                ],
                sequencer = sequenceBuilder.build(
                    'bar',
                    sequences
                )
            ;

            sequencer.start({i: 3}, function(stream) {
                assert.equal(stream.i, 8);

                done();
            });
        })

        it('should fail to build a sequence with a non-existing method', function() {
            assert.throws(
                function() {
                    sequenceBuilder.build(
                        'fail',
                        [
                            {
                                service: 'counter',
                                method: 'divide'
                            }
                        ]
                    );
                },
                /The service "counter" has no method "divide"./
            );
        })
    })

    describe('method "get"', function() {
        it('should retrieve a built sequence', function(done) {
            var sequencer = sequenceBuilder.get('foo');

            sequencer.start({i: 4}, function(stream) {
                assert.equal(stream.i, 7);

                done();
            });
        })

        it('should fail to retrieve a non-existing sequence', function() {
            assert.throws(
                function() {
                    sequenceBuilder.get('dumb');
                },
                /The sequence "dumb" is not defined./
            );
        })
    })

    it('method "compose" should compose many sequences in one sequence', function(done) {
        sequenceBuilder.build(
            'foo',
            [
                {
                    service: 'counter',
                    method: 'inc',
                    arguments: ['@i@', 5],
                    returns: 'u.i'
                },
                {
                    service: 'counter',
                    method: 'dec',
                    arguments: ['@u.i@', 2],
                    returns: 'u.i'
                }
            ]
        );

        sequenceBuilder.build(
            'bar',
            [
                {
                    service: 'scheduler',
                    method: 'start',
                    arguments: ['@u.i@', 1, 10],
                    returns: 'u.i'
                },
                {
                    service: 'scheduler',
                    method: 'start',
                    arguments: ['@u.i@', 2, 5],
                    returns: 'u.j'
                }
            ]
        );

        var sequencer = sequenceBuilder.compose(['foo', 'bar']);

        sequencer.start({i: 5}, function(stream) {
            assert.equal(stream.u.i, 11);
            assert.equal(stream.u.j, 17);

            done();
        });
    })
})
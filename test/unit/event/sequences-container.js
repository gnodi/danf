'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    SequencesContainer = require('../../../lib/common/event/sequences-container'),
    AliasSequenceInterpreter = require('../../../lib/common/event/sequence-interpreter/alias'),
    ChildrenSequenceInterpreter = require('../../../lib/common/event/sequence-interpreter/children'),
    OperationsSequenceInterpreter = require('../../../lib/common/event/sequence-interpreter/operations'),
    InputSequenceInterpreter = require('../../../lib/common/event/sequence-interpreter/input'),
    ParentsSequenceInterpreter = require('../../../lib/common/event/sequence-interpreter/parents'),
    ReferenceResolver = require('../../../lib/common/manipulation/reference-resolver'),
    ReferenceType = require('../../../lib/common/manipulation/reference-type'),
    Flow = require('../../../lib/common/manipulation/flow'),
    FlowDriver = require('../../../lib/common/manipulation/flow-driver'),
    ServicesContainer = require('../../../lib/common/dependency-injection/services-container'),
    Class = require('../../../lib/common/object/class'),
    utils = require('../../../lib/common/utils'),
    async = require('async')
;

var referenceResolver = new ReferenceResolver(),
    servicesContainer = new ServicesContainer(),
    flowDriver = new FlowDriver(async),
    sequencesContainer = new SequencesContainer(flowDriver),
    dataResolver = require('../../fixture/manipulation/data-resolver')
;

var contextType = new ReferenceType();
contextType.name = '@';
contextType.delimiter = '@';

var configType = new ReferenceType();
configType.name = '$';
configType.delimiter = '$';

var sequenceType = new ReferenceType();
sequenceType.name = '#';
sequenceType.delimiter = '#';
sequenceType.allowsConcatenation = false;

var sequenceTagType = new ReferenceType();
sequenceTagType.name = '&';
sequenceTagType.delimiter = '&';
sequenceTagType.allowsConcatenation = false;

referenceResolver.addReferenceType(contextType);
referenceResolver.addReferenceType(configType);
referenceResolver.addReferenceType(sequenceType);
referenceResolver.addReferenceType(sequenceTagType);

sequencesContainer.addSequenceInterpreter(new AliasSequenceInterpreter(sequencesContainer, referenceResolver));
sequencesContainer.addSequenceInterpreter(new ChildrenSequenceInterpreter(sequencesContainer, referenceResolver));
sequencesContainer.addSequenceInterpreter(new OperationsSequenceInterpreter(sequencesContainer, referenceResolver, servicesContainer));
sequencesContainer.addSequenceInterpreter(new InputSequenceInterpreter(sequencesContainer, referenceResolver, dataResolver));
sequencesContainer.addSequenceInterpreter(new ParentsSequenceInterpreter(sequencesContainer, referenceResolver));

var Computer = function() {};
utils.extend(Class, Computer);
Computer.prototype.add = function(a, b) {
    return a + b;
};
Computer.prototype.substract = function(a, b) {
    return a - b;
};
Computer.prototype.multiply = function(a, b) {
    return a * b;
};
Computer.prototype.divide = function(a, b) {
    return a / b;
};
servicesContainer.set('computer', new Computer());

var AsyncComputer = function() {};
utils.extend(Class, AsyncComputer);
AsyncComputer.prototype.add = function(a, b, delay) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(a + b);
            },
            delay
        );
    });
};
AsyncComputer.prototype.substract = function(a, b, delay) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(a - b);
            },
            delay
        );
    });
};
AsyncComputer.prototype.multiply = function(a, b, delay) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(a * b);
            },
            delay
        );
    });
};
AsyncComputer.prototype.divide = function(a, b, delay) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(a / b);
            },
            delay
        );
    });
};
servicesContainer.set('asyncComputer', new AsyncComputer());

var config = {
    sequences: {
        a: {
            operations: [
                {
                    order: 0,
                    service: 'computer',
                    method: 'add',
                    arguments: [2, 3],
                    scope: 'result'
                }
            ]
        },
        b: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@result@', 3, 40],
                    scope: 'result'
                },
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'multiply',
                    arguments: ['@result@', 3, 10],
                    scope: 'result'
                }
            ]
        },
        c: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@result@', 3, 40],
                    scope: 'result'
                },
                {
                    order: 1,
                    service: 'asyncComputer',
                    method: 'multiply',
                    arguments: ['@result@', 3, 10],
                    scope: 'result'
                }
            ],
            parents: [
                {
                    order: 1,
                    name: 'e',
                    input: {
                        result: '@result@'
                    },
                    output: {
                        result: '@result@'
                    }
                }
            ]
        },
        d: {
            operations: [
                {
                    order: 0,
                    service: 'computer',
                    method: 'add',
                    arguments: [1, 3],
                    scope: 'result'
                }
            ],
            children: [
                {
                    order: 1,
                    name: 'c',
                    input: {
                        result: '@result@'
                    },
                    output: {
                        result: '@result@'
                    }
                }
            ],
            parents: [
                {
                    order: -1,
                    name: 'f',
                    output: {
                        result: '@result@'
                    }
                }
            ]
        },
        e: {
            operations: [
                {
                    order: 0,
                    service: 'computer',
                    method: 'add',
                    arguments: ['@result@', 2],
                    scope: 'result'
                }
            ]
        },
        f: {
            operations: [
                {
                    order: 0,
                    service: 'computer',
                    method: 'add',
                    arguments: ['@result@', 2],
                    scope: 'result'
                }
            ]
        },
        g: {
            operations: [
                {
                    order: 0,
                    service: 'computer',
                    method: 'add',
                    arguments: ['@x@', 2],
                    scope: 'x'
                },
                {
                    order: 2,
                    service: 'computer',
                    method: 'substract',
                    arguments: ['@x@', '@y@'],
                    scope: 'result'
                }
            ],
            children: [
                {
                    order: 1,
                    name: 'c',
                    input: {
                        result: '@x@'
                    },
                    output: {
                        x: '@result@'
                    }
                },
                {
                    order: -1,
                    name: 'e',
                    input: {
                        result: '@y@'
                    },
                    output: {
                        y: '@result@'
                    }
                }
            ]
        },
        h: {
            input: {
                x: {
                    type: 'number',
                    default: 2
                },
                y: {
                    type: 'number',
                    required: true
                }
            },
            operations: [
                {
                    order: 0,
                    service: 'computer',
                    method: 'add',
                    arguments: ['@x@', '@y@'],
                    scope: 'result'
                }
            ]
        },
    }
};

var sequenceTests = [
    {
        name: 'a',
        input: {},
        expected: {result: 5}
    },
    {
        name: 'b',
        input: {result: 1},
        expected: {result: 4}
    },
    {
        name: 'c',
        input: {result: 1},
        expected: {result: 12}
    },
    {
        name: 'd',
        input: {},
        expected: {result: 21}
    },
    {
        name: 'e',
        input: {result: 1},
        expected: {result: 18}
    },
    {
        name: 'f',
        input: {},
        expected: {result: 23}
    },
    {
        name: 'g',
        input: {x: 1, y: 3},
        expected: {x: 18, y: 24, result: -6}
    },
    {
        name: 'h',
        input: {y: 5},
        expected: {x: 2, y: 5, result: 7}
    }
];

describe('SequencesContainer', function() {
    it('method "handleRegistryChange" should set the definitions of the configured sequences', function() {
        sequencesContainer.config = config;
        sequencesContainer.handleRegistryChange(config.sequences);

        assert(sequencesContainer.hasDefinition('a'));
        assert(sequencesContainer.hasDefinition('b'));
    })

    describe('method "get"', function() {
        sequenceTests.forEach(function(test) {
            it('should allow to retrieve a built sequence', function(done) {
                var sequence = sequencesContainer.get(test.name),
                    end = function() {
                        assert.deepEqual(
                            flow.stream,
                            test.expected
                        );

                        done();
                    },
                    flow = new Flow(test.input, null, end)
                ;

                sequence(flow);
            })
        })

        /*it('should fail to instantiate a sequence with a circular dependency', function() {
            assert.throws(
                function() {
                    sequencesContainer.config = {};
                    sequencesContainer.handleRegistryChange(
                        {
                            a: {
                                class: function() {},
                                properties: {
                                    b: '#b#'
                                }
                            },
                            b: {
                                class: function() {},
                                properties: {
                                    c: '#c#'
                                }
                            },
                            c: {
                                class: function() {},
                                properties: {
                                    a: '#a#'
                                }
                            }
                        }
                    );
                },
                /The circular dependency \["a" -> "b" -> "c" -> "a"\] prevent to build the sequence "a"\./
            );
        })*/
    })

    /*describe('method "set"', function() {
        it('should replace an already instanciated sequence', function() {
            sequencesContainer.config = config;
            sequencesContainer.handleRegistryChange(config.sequences);

            var storage = sequencesContainer.set('storage.local', { name: 'local super storage' }),
                provider = sequencesContainer.get('provider.bigImages')
            ;

            assert.equal('local super storage', provider.storages[0].name);
        })
    })

    describe('method "unset"', function() {
        it('should unset an instanciated sequence', function() {
            assert(sequencesContainer.has('storage.local'));
            sequencesContainer.unset('storage.local');
            assert(!sequencesContainer.has('storage.local'));
        })
    })*/
})

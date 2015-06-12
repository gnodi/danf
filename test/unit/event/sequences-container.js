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
sequencesContainer.addSequenceInterpreter(new ChildrenSequenceInterpreter(sequencesContainer, referenceResolver, flowDriver));
sequencesContainer.addSequenceInterpreter(new OperationsSequenceInterpreter(sequencesContainer, referenceResolver, servicesContainer, flowDriver));
sequencesContainer.addSequenceInterpreter(new InputSequenceInterpreter(sequencesContainer, referenceResolver, dataResolver));
sequencesContainer.addSequenceInterpreter(new ParentsSequenceInterpreter(sequencesContainer, referenceResolver, flowDriver));

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
        i: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@result@', '@@.@@'],
                    collection: {
                        input: [1, 2, 4],
                        method: 'forEachOf',
                        aggregate: false
                    },
                    scope: 'result'
                }
            ]
        },
        j: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@result@', '@@.@@'],
                    collection: {
                        input: {a: 1, b: 2, c: 4},
                        method: 'forEachOf',
                        aggregate: false
                    },
                    scope: 'result'
                }
            ]
        },
        k: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@result@', '@@.@@'],
                    collection: {
                        input: [1, 2, 4],
                        method: 'forEachOfSeries',
                        aggregate: true
                    },
                    scope: 'result'
                }
            ]
        },
        l: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@result@', '@@.@@'],
                    collection: {
                        input: [1, 2, 4],
                        method: 'forEachOf',
                        aggregate: function(results) {
                            var result = 1;

                            for (var i = 0; i < results.length; i++) {
                                result *= results[i];
                            }

                            return result;
                        }
                    },
                    scope: 'result'
                }
            ]
        },
        m: {
            operations: [
                {
                    order: 1,
                    service: 'asyncComputer',
                    method: 'multiply',
                    arguments: ['@result@', 2],
                    scope: 'result'
                }
            ],
            children: [
                {
                    order: 0,
                    name: 'k',
                    input: {
                        result: '@result@'
                    },
                    output: {
                        result: '@result@'
                    }
                }
            ]
        },
        n: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@result@', '@@value@@'],
                    collection: {
                        input: {a: {value: 1}, b: {value: 2}, c: {value: 4}},
                        method: 'forEachOf',
                        aggregate: false
                    },
                    scope: 'result'
                }
            ]
        },
        o: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@result@', '@@value@@'],
                    collection: {
                        input: {a: {value: 1, foo: 'bar'}, b: {value: 2}, c: {value: 4}},
                        method: 'forEachOf',
                        aggregate: false,
                        scope: 'value'
                    },
                    scope: 'result'
                }
            ]
        },
        p: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@a@@', '@@b@@'],
                    collection: {
                        input: '@result@',
                        method: 'forEachOf',
                        aggregate: false
                    },
                    scope: 'result'
                }
            ]
        },
        q: {
            operations: [
                {
                    order: 1,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@result@', 1],
                    scope: 'result'
                }
            ],
            children: [
                {
                    order: 0,
                    name: 'd',
                    output: {
                        result: '@result@'
                    }
                }
            ]
        },
        r: {
            children: [
                {
                    order: 0,
                    name: 'c',
                    input: {
                        result: '@@.@@'
                    },
                    collection: {
                        input: [1, 2],
                        method: 'forEachOfSeries',
                        aggregate: false
                    },
                    output: {
                        result: '@result@'
                    }
                }
            ]
        },
        s: {
            children: [
                {
                    order: 0,
                    name: 'g',
                    input: {
                        x: '@result@',
                        y: '@@.@@'
                    },
                    collection: {
                        input: [3, 1],
                        method: 'forEachOfSeries',
                        aggregate: true
                    },
                    output: {
                        result: '@result@'
                    }
                }
            ],
            parents: [
                {
                    order: 0,
                    name: 't',
                    input: {
                        result: '@@result@@'
                    },
                    collection: {
                        input: [{result: 2}, {result: 1}],
                        method: 'forEachOfSeries',
                        aggregate: true
                    },
                    output: {
                        result: '@result@'
                    }
                }
            ]
        },
        t: {
        }
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
    },
    {
        name: 'i',
        input: {result: 1},
        expected: {result: [2, 3, 5]}
    },
    {
        name: 'j',
        input: {result: 1},
        expected: {result: {a: 2, b: 3, c: 5}}
    },
    {
        name: 'k',
        input: {result: 1},
        expected: {result: 8}
    },
    {
        name: 'l',
        input: {result: 1},
        expected: {result: 30}
    },
    {
        name: 'm',
        input: {result: 1},
        expected: {result: 16}
    },
    {
        name: 'n',
        input: {result: 2},
        expected: {result: {a: 3, b: 4, c: 6}}
    },
    {
        name: 'o',
        input: {result: 3},
        expected: {result: {a: {value: 4, foo: 'bar'}, b: {value: 5}, c: {value: 7}}}
    },
    {
        name: 'p',
        input: {result: [{a: 1, b: 2}, {a: 2, b: 3}]},
        expected: {result: [3, 5]}
    },
    {
        name: 'q',
        input: {},
        expected: {result: 22}
    },
    {
        name: 'r',
        input: {},
        expected: {result: [12, 15]}
    },
    {
        name: 's',
        input: {result: 1},
        expected: {result: -21}
    },
    {
        name: 't',
        input: {result: 1},
        expected: {result: -21}
    }
];

var rebuildSequenceTests = [
    {
        name: 'c',
        input: {result: 1},
        expected: {result: 15}
    },
    {
        name: 'd',
        input: {},
        expected: {result: 24}
    },
    {
        name: 'f',
        input: {result: 1},
        expected: {result: 26}
    }
];

describe('SequencesContainer', function() {
    sequencesContainer.config = config;
    sequencesContainer.handleRegistryChange(config.sequences);

    it('method "handleRegistryChange" should set the definitions of the configured sequences and build them', function() {
        assert(sequencesContainer.hasDefinition('a'));
        assert(sequencesContainer.hasDefinition('b'));
        assert(sequencesContainer.hasInterpretation('a'));
        assert(sequencesContainer.hasInterpretation('b'));
        assert(sequencesContainer.has('a'));
        assert(sequencesContainer.has('b'));
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

        it('should retrieve a sequence that fails to execute with a bad input', function() {
            assert.throws(
                function() {
                    var sequence = sequencesContainer.get('h'),
                        end = function() {},
                        flow = new Flow({x: 0}, null, end)
                    ;

                    sequence(flow);
                },
                /The value is required for the field "sequence\[h\].y"\./
            );
        })
    })

    describe('method "setDefinition"', function() {
        rebuildSequenceTests.forEach(function(test) {
            it('should allow to replace an already instanciated sequence and rebuild all sequences', function(done) {
                sequencesContainer.setDefinition(
                    'c',
                    {
                        operations: [
                            {
                                order: 0,
                                service: 'asyncComputer',
                                method: 'add',
                                arguments: ['@result@', 4, 40],
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
                    }
                );

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
    })

    describe('method "setAlias"', function() {
        it('should set an aliased sequence', function(done) {
            sequencesContainer.setAlias('z', 'a');

            assert(sequencesContainer.hasDefinition('z'));
            assert(sequencesContainer.hasInterpretation('z'));
            assert(sequencesContainer.has('z'));

            var sequence = sequencesContainer.get('z'),
                end = function() {
                    assert.deepEqual(
                        flow.stream,
                        {result: 5}
                    );

                    done();
                },
                flow = new Flow({}, null, end)
            ;

            sequence(flow);
        })
    })
})

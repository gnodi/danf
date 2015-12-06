'use strict';

require('../../../lib/common/init');

var assert = require('assert'),
    SequencesContainer = require('../../../lib/common/sequencing/sequences-container'),
    AliasSequenceInterpreter = require('../../../lib/common/sequencing/sequence-interpreter/alias'),
    ChildrenSequenceInterpreter = require('../../../lib/common/sequencing/sequence-interpreter/children'),
    CollectionsSequenceInterpreter = require('../../../lib/common/sequencing/sequence-interpreter/collections'),
    OperationsSequenceInterpreter = require('../../../lib/common/sequencing/sequence-interpreter/operations'),
    StreamSequenceInterpreter = require('../../../lib/common/sequencing/sequence-interpreter/stream'),
    ParentsSequenceInterpreter = require('../../../lib/common/sequencing/sequence-interpreter/parents'),
    CollectionInterpreter = require('../../../lib/common/sequencing/collection-interpreter'),
    UniqueIdGenerator = require('../../../lib/common/manipulation/unique-id-generator'),
    ReferenceResolver = require('../../../lib/common/manipulation/reference-resolver'),
    FlowContext = require('../../../lib/common/sequencing/flow-context'),
    ReferencesResolver = require('../../../lib/common/sequencing/references-resolver'),
    ReferenceType = require('../../../lib/common/manipulation/reference-type'),
    Flow = require('../../../lib/common/manipulation/flow'),
    FlowDriver = require('../../../lib/common/manipulation/flow-driver'),
    Sequence = require('../../../lib/common/sequencing/sequence'),
    ServicesContainer = require('../../../lib/common/dependency-injection/services-container'),
    utils = require('../../../lib/common/utils'),
    async = require('async')
;

var mapProvider = require('../../fixture/manipulation/map-provider');
var FlowProvider = function() {};
FlowProvider.prototype.provide = function(properties) {
    var flow = new Flow();

    flow.stream = properties.stream;
    flow.initialScope = properties.initialScope;
    flow.context = properties.context;
    flow.callback = properties.callback;

    flow.__init();

    return flow;
}

var SequenceProvider = function(flowProvider, uniqueIdGenerator) {
    this.flowProvider = flowProvider;
    this.uniqueIdGenerator = uniqueIdGenerator;
};
SequenceProvider.prototype.provide = function(properties) {
    var sequence = new Sequence();

    sequence.operation = properties.operation;
    sequence.flowProvider = this.flowProvider;
    sequence.mapProvider = mapProvider;
    sequence.uniqueIdGenerator = this.uniqueIdGenerator;

    return sequence;
}

var Logger = function() {};
Logger.prototype.log = function() {
}

var uniqueIdGenerator = new UniqueIdGenerator(),
    referenceResolver = new ReferenceResolver(),
    flowContext = new FlowContext(),
    referencesResolver = new ReferencesResolver(),
    servicesContainer = new ServicesContainer(),
    flowDriver = new FlowDriver(),
    asynchronousCollections = require('../../fixture/manipulation/asynchronous-collections'),
    collectionInterpreter = new CollectionInterpreter(),
    flowProvider = new FlowProvider(),
    sequenceProvider = new SequenceProvider(flowProvider, uniqueIdGenerator),
    sequencesContainer = new SequencesContainer(),
    dataResolver = require('../../fixture/manipulation/data-resolver'),
    logger = new Logger()
;

referencesResolver.referenceResolver = referenceResolver;
referencesResolver.flowContext = flowContext;
referencesResolver.config = {memo: 2};

flowDriver.async = async;

collectionInterpreter.referencesResolver = referencesResolver;
collectionInterpreter.flowDriver = flowDriver;
collectionInterpreter.logger = logger;
collectionInterpreter.asynchronousCollections = asynchronousCollections;

sequencesContainer.flowDriver = flowDriver;
sequencesContainer.sequenceProvider = sequenceProvider;

var contextType = new ReferenceType();
contextType.name = '@';
contextType.delimiter = '@';

var globalContextType = new ReferenceType();
globalContextType.name = '!';
globalContextType.delimiter = '!';

var memoryType = new ReferenceType();
memoryType.name = '~';
memoryType.delimiter = '~';

var configType = new ReferenceType();
configType.name = '$';
configType.delimiter = '$';

var sequenceType = new ReferenceType();
sequenceType.name = '#';
sequenceType.delimiter = '#';
sequenceType.allowsConcatenation = false;

var sequenceCollectionType = new ReferenceType();
sequenceCollectionType.name = '&';
sequenceCollectionType.delimiter = '&';
sequenceCollectionType.allowsConcatenation = false;

referenceResolver.addReferenceType(contextType);
referenceResolver.addReferenceType(globalContextType);
referenceResolver.addReferenceType(memoryType);
referenceResolver.addReferenceType(configType);
referenceResolver.addReferenceType(sequenceType);
referenceResolver.addReferenceType(sequenceCollectionType);

var aliasSequenceInterpreter = new AliasSequenceInterpreter(),
    childrenSequenceInterpreter = new ChildrenSequenceInterpreter(),
    collectionsSequenceInterpreter = new CollectionsSequenceInterpreter(),
    operationsSequenceInterpreter = new OperationsSequenceInterpreter(),
    streamSequenceInterpreter = new StreamSequenceInterpreter(),
    parentsSequenceInterpreter = new ParentsSequenceInterpreter()
;

aliasSequenceInterpreter.sequencesContainer = sequencesContainer;
aliasSequenceInterpreter.logger = logger;
childrenSequenceInterpreter.sequencesContainer = sequencesContainer;
childrenSequenceInterpreter.logger = logger;
childrenSequenceInterpreter.referencesResolver = referencesResolver;
childrenSequenceInterpreter.collectionInterpreter = collectionInterpreter;
childrenSequenceInterpreter.uniqueIdGenerator = uniqueIdGenerator;
collectionsSequenceInterpreter.sequencesContainer = sequencesContainer;
collectionsSequenceInterpreter.logger = logger;
operationsSequenceInterpreter.sequencesContainer = sequencesContainer;
operationsSequenceInterpreter.logger = logger;
operationsSequenceInterpreter.referencesResolver = referencesResolver;
operationsSequenceInterpreter.servicesContainer = servicesContainer;
operationsSequenceInterpreter.collectionInterpreter = collectionInterpreter;
streamSequenceInterpreter.sequencesContainer = sequencesContainer;
streamSequenceInterpreter.logger = logger;
streamSequenceInterpreter.dataResolver = dataResolver;
parentsSequenceInterpreter.sequencesContainer = sequencesContainer;
parentsSequenceInterpreter.logger = logger;
parentsSequenceInterpreter.referencesResolver = referencesResolver;
parentsSequenceInterpreter.collectionInterpreter = collectionInterpreter;
parentsSequenceInterpreter.uniqueIdGenerator = uniqueIdGenerator;

sequencesContainer.addSequenceInterpreter(aliasSequenceInterpreter);
sequencesContainer.addSequenceInterpreter(childrenSequenceInterpreter);
sequencesContainer.addSequenceInterpreter(collectionsSequenceInterpreter);
sequencesContainer.addSequenceInterpreter(operationsSequenceInterpreter);
sequencesContainer.addSequenceInterpreter(streamSequenceInterpreter);
sequencesContainer.addSequenceInterpreter(parentsSequenceInterpreter);

var Computer = function() {};
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
AsyncComputer.prototype.add = function(a, b, delay) {
    delay = delay ? delay : 10;

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
    delay = delay ? delay : 10;

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
    delay = delay ? delay : 10;

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
    delay = delay ? delay : 10;

    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(a / b);
            },
            delay
        );
    });
};
AsyncComputer.prototype.isGreaterThan = function(a, b, delay) {
    delay = delay ? delay : 10;

    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(a > b);
            },
            delay
        );
    });
};
AsyncComputer.prototype.addSubstract = function(a, b, delay) {
    delay = delay ? delay : 10;

    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync([a + b, a - b]);
            },
            delay
        );
    });
};
AsyncComputer.prototype.getAdjacentNumbers = function(a, delay) {
    delay = delay ? delay : 10;

    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync([a - 1, a, a + 1]);
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
                    target: 'e',
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
                    target: 'f',
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
            stream: {
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
        i: {
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
        j: {
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
        k: {
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
        l: {
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
        m: {
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
        n: {
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
        o: {
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
        p: {
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
        q: {
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
        r: {
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
        s: {
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
                    target: 't',
                    input: {
                        result: '@@result@@'
                    },
                    collection: {
                        input: [{result: 3}, {result: 4}],
                        method: 'forEachOfSeries',
                        aggregate: function(stream) {
                            var result = 0;

                            for (var i = 0; i < stream.length; i++) {
                                result += stream[i].result;
                            }

                            return {result: result};
                        }
                    },
                    output: {
                        result: '@result@'
                    }
                }
            ]
        },
        t: {
        },
        u: {
            operations: [
                {
                    order: 0,
                    service: 'computer',
                    method: 'add',
                    arguments: ['@a@', '!b!', 40],
                    scope: 'a'
                }
            ]
        },
        each: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', 1],
                    collection: {
                        input: '@.@',
                        method: 'each'
                    },
                    scope: '.'
                }
            ]
        },
        eachSeries: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', 1],
                    collection: {
                        input: '@.@',
                        method: 'eachSeries'
                    },
                    scope: '.'
                }
            ]
        },
        eachLimit: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', 1],
                    collection: {
                        input: '@.@',
                        method: 'eachLimit',
                        parameters: {
                            limit: 2
                        }
                    },
                    scope: '.'
                }
            ]
        },
        forEachOf: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', 1],
                    collection: {
                        input: '@.@',
                        method: 'forEachOf',
                        aggregate: false
                    },
                    scope: '.'
                }
            ]
        },
        forEachOfSeries: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', '@result@'],
                    collection: {
                        input: '@input@',
                        method: 'forEachOfSeries',
                        aggregate: true
                    },
                    scope: 'result'
                }
            ]
        },
        forEachOfLimit: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', 1],
                    collection: {
                        input: '@.@',
                        method: 'forEachOfLimit',
                        aggregate: false,
                        parameters: {
                            limit: 2
                        }
                    },
                    scope: '.'
                }
            ]
        },
        map: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', 1],
                    collection: {
                        input: '@.@',
                        method: 'map'
                    },
                    scope: '.'
                }
            ]
        },
        mapSeries: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', '@operand@'],
                    collection: {
                        input: '@input@',
                        method: 'mapSeries'
                    },
                    scope: 'result'
                }
            ]
        },
        mapLimit: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', 1],
                    collection: {
                        input: '@.@',
                        method: 'mapLimit',
                        parameters: {
                            limit: 2
                        },
                        aggregate: function(stream) {
                            var result = 1;

                            for (var i = 0; i < stream.length; i++) {
                                result *= stream[i];
                            }

                            return result;
                        }
                    },
                    scope: '.'
                }
            ]
        },
        filter: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'isGreaterThan',
                    arguments: ['@@.@@', 4],
                    collection: {
                        input: '@.@',
                        method: 'filter'
                    },
                    scope: '.'
                }
            ]
        },
        filterSeries: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'isGreaterThan',
                    arguments: ['@@.@@', 4],
                    collection: {
                        input: '@.@',
                        method: 'filterSeries'
                    },
                    scope: '.'
                }
            ]
        },
        reject: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'isGreaterThan',
                    arguments: ['@@.@@', 4],
                    collection: {
                        input: '@.@',
                        method: 'reject'
                    },
                    scope: '.'
                }
            ]
        },
        rejectSeries: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'isGreaterThan',
                    arguments: ['@@.@@', 4],
                    collection: {
                        input: '@.@',
                        method: 'rejectSeries'
                    },
                    scope: '.'
                }
            ]
        },
        reduce: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'addSubstract',
                    arguments: ['@@.@@', '~0~'],
                    collection: {
                        input: '@.@',
                        method: 'reduce',
                        parameters: {
                            memo: [1]
                        }
                    },
                    scope: '.'
                }
            ]
        },
        reduceRight: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', '~.~'],
                    collection: {
                        input: '@input@',
                        method: 'reduceRight',
                        parameters: {
                            memo: '$memo$'
                        }
                    },
                    scope: 'result'
                }
            ]
        },
        detect: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'isGreaterThan',
                    arguments: ['@@.@@', 4],
                    collection: {
                        input: '@input@',
                        method: 'detect',
                        aggregate: true
                    },
                    scope: 'result'
                }
            ]
        },
        detectSeries: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'isGreaterThan',
                    arguments: ['@@.@@', 4],
                    collection: {
                        input: '@input@',
                        method: 'detectSeries'
                    },
                    scope: 'result'
                }
            ]
        },
        sortBy: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'multiply',
                    arguments: ['@@.@@', -1],
                    collection: {
                        input: '@.@',
                        method: 'sortBy'
                    },
                    scope: '.'
                }
            ]
        },
        some: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'isGreaterThan',
                    arguments: ['@@.@@', 4],
                    collection: {
                        input: '@input@',
                        method: 'some'
                    },
                    scope: 'result'
                }
            ]
        },
        every: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'isGreaterThan',
                    arguments: ['@@.@@', 4],
                    collection: {
                        input: '@input@',
                        method: 'every'
                    },
                    scope: 'result'
                }
            ]
        },
        concat: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'getAdjacentNumbers',
                    arguments: ['@@value@@', '@@delay@@'],
                    collection: {
                        input: '@.@',
                        method: 'concat'
                    },
                    scope: '.'
                }
            ]
        },
        concatSeries: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'getAdjacentNumbers',
                    arguments: ['@@value@@', '@@delay@@'],
                    collection: {
                        input: '@.@',
                        method: 'concatSeries'
                    },
                    scope: 'result'
                }
            ]
        },
        _mapLimit: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@@.@@', 1],
                    collection: {
                        input: '@.@',
                        method: 'mapLimit',
                        parameters: {}
                    },
                    scope: '.'
                }
            ]
        },
        collectionsA: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: [49, 51],
                    scope: 'result'
                }
            ],
            collections: ['foo']
        },
        collectionsB: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: [49, 51],
                    scope: 'result'
                }
            ],
            collections: ['bar']
        },
        collectionsC: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: [49, 51],
                    scope: 'result'
                }
            ],
            collections: ['foo', 'bar']
        },
        collectionsD: {
            operations: [
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'add',
                    arguments: ['@result@', '@input@'],
                    scope: 'result'
                }
            ],
            parents: [
                {
                    order: 1,
                    target: '&foo&',
                    input: {
                        input: 1,
                        result: '@result@'
                    },
                    output: {
                        result: '@result@'
                    }
                },
                {
                    order: 2,
                    target: '&bar&',
                    input: {
                        input: 2,
                        result: '@result@'
                    },
                    output: {
                        result: '@result@'
                    }
                }
            ]
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
        input: {foo: 'bar'},
        expected: {result: 21, foo: 'bar'}
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
        input: {result: 2},
        expected: {result: 3}
    },
    {
        name: 'u',
        input: {a: 11},
        context: {b: 22},
        expected: {a: 33}
    }
];

var sequenceOperationCollectionTests = [
    {
        name: 'each',
        input: [1, 4, 2],
        expected: [1, 4, 2]
    },
    {
        name: 'eachSeries',
        input: [2, 5, 3],
        expected: [2, 5, 3]
    },
    {
        name: 'eachLimit',
        input: [3, 4, 1],
        expected: [3, 4, 1]
    },
    {
        name: 'forEachOf',
        input: [1, 4, 4],
        expected: [2, 5, 5]
    },
    {
        name: 'forEachOfSeries',
        input: {
            input: [3, 5, 7],
            result: 1
        },
        expected: {
            input: [3, 5, 7],
            result: 16
        }
    },
    {
        name: 'forEachOfLimit',
        input: [6, 2, 2],
        expected: [7, 3, 3]
    },
    {
        name: 'map',
        input: [4, 3, 2],
        expected: [5, 4, 3]
    },
    {
        name: 'mapSeries',
        input: {
            input: [4, 4, 2],
            operand: 2
        },
        expected: {
            input: [4, 4, 2],
            result: [6, 6, 4],
            operand: 2
        }
    },
    {
        name: 'mapLimit',
        input: [1, 9, 7],
        expected: 160
    },
    {
        name: 'filter',
        input: [3, 4, 7],
        expected: [7]
    },
    {
        name: 'filterSeries',
        input: [3, 5, 7],
        expected: [5, 7]
    },
    {
        name: 'reject',
        input: [2, 4, 7],
        expected: [2, 4]
    },
    {
        name: 'rejectSeries',
        input: [2, 5, 7],
        expected: [2]
    },
    {
        name: 'reduce',
        input: [4, 5, 4],
        expected: [14, -6]
    },
    {
        name: 'reduceRight',
        input: {input: [5, 4, 4], foo: 'bar'},
        expected: {input: [5, 4, 4], result: 15, foo: 'bar'}
    },
    {
        name: 'detect',
        input: {input: [1, 3, 2]},
        expected: {input: [1, 3, 2], result: null}
    },
    {
        name: 'detectSeries',
        input: {input: [2, 5, 1]},
        expected: {input: [2, 5, 1], result: 5}
    },
    {
        name: 'sortBy',
        input: [8, 3, 6],
        expected: [8, 6, 3]
    },
    {
        name: 'some',
        input: {input: [2, 5, 2]},
        expected: {input: [2, 5, 2], result: true}
    },
    {
        name: 'some',
        input: {input: [2, 3, 2]},
        expected: {input: [2, 3, 2], result: false}
    },
    {
        name: 'every',
        input: {input: [5, 5, 7]},
        expected: {input: [5, 5, 7], result: true}
    },
    {
        name: 'every',
        input: {input: [5, 5, 3]},
        expected: {input: [5, 5, 3], result: false}
    },
    {
        name: 'concat',
        input: [
            {value: 8, delay: 90},
            {value: 5, delay: 50},
            {value: 2, delay: 10}
        ],
        expected: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    {
        name: 'concatSeries',
        input: [
            {value: 8, delay: 70},
            {value: 5, delay: 40},
            {value: 2, delay: 10}
        ],
        expected: {result: [7, 8, 9, 4, 5, 6, 1, 2, 3]}
    }
];

var sequenceCollectionsTests = [
    {
        name: 'collectionsA',
        input: {},
        expected: {result: 101}
    },
    {
        name: 'collectionsB',
        input: {},
        expected: {result: 102}
    },
    {
        name: 'collectionsC',
        input: {},
        expected: {result: 103}
    },
    {
        name: 'collectionsD',
        input: {input: 1, result: 1},
        expected: {input: 1, result: 2}
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
                    end = function(result) {
                        assert.deepEqual(
                            result,
                            test.expected
                        );

                        done();
                    }
                ;

                sequence.execute(test.input, test.context || {}, '.', end);
            })
        })

        sequenceOperationCollectionTests.forEach(function(test) {
            it('should allow to retrieve a built sequence with operations on collections', function(done) {
                var sequence = sequencesContainer.get(test.name),
                    end = function(result) {
                        assert.deepEqual(
                            result,
                            test.expected
                        );

                        done();
                    }
                ;

                sequence.execute(test.input, {}, '.', end);
            })
        })

        sequenceCollectionsTests.forEach(function(test) {
            it('should allow to retrieve a built sequence with parent on sequence collection', function(done) {
                var sequence = sequencesContainer.get(test.name),
                    end = function(result) {
                        assert.deepEqual(
                            result,
                            test.expected
                        );

                        done();
                    }
                ;

                sequence.execute(test.input, {}, '.', end);
            })
        })

        it('should retrieve a sequence that fails to execute with a bad input', function() {
            assert.throws(
                function() {
                    var sequence = sequencesContainer.get('h'),
                        end = function() {}
                    ;

                    sequence.execute({x: 0}, {}, '.', end);
                },
                /The value is required for the field "sequence\[h\].y"\./
            );
        })

        it('should retrieve a sequence that fails to execute with missing parameter for a collection', function() {
            assert.throws(
                function() {
                    var sequence = sequencesContainer.get('_mapLimit'),
                        end = function() {}
                    ;

                    sequence.execute({}, {}, '.', end);
                },
                /The parameter "limit" must be defined for the collection method "mapLimit"\./
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
                                target: 'e',
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
                    end = function(result) {
                        assert.deepEqual(
                            result,
                            test.expected
                        );

                        done();
                    }
                ;

                sequence.execute(test.input, {}, null, end);
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
                end = function(result) {
                    assert.deepEqual(
                        result,
                        {result: 5}
                    );

                    done();
                }
            ;

            sequence.execute({}, {}, null, end);
        })
    })
})
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
    sequencesContainer = new SequencesContainer(flowDriver)
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
sequencesContainer.addSequenceInterpreter(new InputSequenceInterpreter(sequencesContainer, referenceResolver));
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
            function() {console.log(a, b, a + b);
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
                console.log(a, b, a * b);
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
                    arguments: [2, 3, 40],
                    scope: 'result'
                },
                {
                    order: 0,
                    service: 'asyncComputer',
                    method: 'multiply',
                    arguments: [2, 3, 10],
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
                    order: 0,
                    service: 'asyncComputer',
                    method: 'multiply',
                    arguments: ['@result@', 3, 10],
                    scope: 'result'
                }
            ]
        }
    }
};

describe('SequencesContainer', function() {
    it('method "handleRegistryChange" should set the definitions of the configured sequences', function() {
        sequencesContainer.config = config;
        sequencesContainer.handleRegistryChange(config.sequences);

        assert(sequencesContainer.hasDefinition('a'));
        assert(sequencesContainer.hasDefinition('b'));
    })

    describe('method "get"', function() {
        it('should allow to retrieve a built sequence', function(done) {
            var sequence = sequencesContainer.get('a'),
                end = function(err, results) {
                    assert.deepEqual(
                        flow.stream,
                        {
                            result: 5
                        }
                    );

                    done();
                },
                flow = new Flow({}, null, end)
            ;

            sequence(flow, end);
        })

        it('should allow to retrieve a built sequence', function(done) {
            var sequence = sequencesContainer.get('b'),
                end = function(err, results) {
                    assert.deepEqual(
                        flow.stream,
                        {
                            result: 6
                        }
                    );

                    done();
                },
                flow = new Flow({result: 1}, null, end)
            ;

            sequence(flow, end);
        })

        /*it('should resolve and inject the dependencies of the sequences', function() {
            assert.deepEqual(expectedBigImagesProvider, utils.clean(provider));
        })

        it('should resolve the tags', function() {
            var manager = sequencesContainer.get('manager');

            assert.notEqual(manager.providers.bigImages, undefined);
            assert.equal(manager.storages.length, 2);
        })

        it('should add proxies to the properties of the sequences', function() {
            var manager = sequencesContainer.get('manager'),
                provider = manager.providers.bigImages
            ;

            assert.equal(provider.provide(), 'provider');
        })

        it('should fail to resolve a non-existent reference', function() {
            assert.throws(
                function() {
                    var badConfig = utils.clone(config);

                    badConfig.sequences.provider.declinations = '$providersTypo$';
                    sequencesContainer.config = badConfig;
                    sequencesContainer.handleRegistryChange(badConfig.sequences);
                },
                /The reference "\$providersTypo\$" in source "\$providersTypo\$" declared in the definition of the sequence "provider" cannot be resolved./
            );

            assert.throws(
                function() {
                    var badConfig = utils.clone(config);

                    badConfig.sequences.provider.properties.rules = '>rule.@rulesTypo@>provider>@@rules.@rules@@@>';
                    sequencesContainer.config = badConfig;
                    sequencesContainer.handleRegistryChange(badConfig.sequences);
                },
                /One of the references "@rulesTypo@", "@rules@" in source ">rule.@rulesTypo@>provider>@@rules.@rules@@@>" declared in the definition of the sequence "provider.smallImages" cannot be resolved./
            );
        })

        it('should fail to instantiate an abstract sequence', function() {
            assert.throws(
                function() {
                    sequencesContainer.config = {};
                    sequencesContainer.handleRegistryChange(
                        {
                            a: {
                                class: function() {},
                                abstract: true
                            }
                        }
                    );

                    sequencesContainer.get('a');
                },
                /The sequence of id "a" is an abstract sequence and cannot be instantiated\./
            );
        })

        it('should fail to instantiate a sequence defined on an abstract class', function() {
            assert.throws(
                function() {
                    var AbstractClass = function() {};

                    AbstractClass.defineAsAbstract();
                    AbstractClass.__metadata.id = 'A';

                    sequencesContainer.config = {};
                    sequencesContainer.handleRegistryChange(
                        {
                            a: {
                                class: AbstractClass
                            }
                        }
                    );

                    sequencesContainer.get('a');
                },
                /The sequence "a" could not be instantiated because its class "A" is an abstract class\./
            );
        })

        it('should fail to instantiate a sequence with a circular dependency', function() {
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

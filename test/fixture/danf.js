'use strict';

var utils = require('../../lib/common/utils.js'),
    assert = require('assert')
;

var Manager = function() {};
Manager.defineImplementedInterfaces(['ManagerInterface']);
Manager.prototype.__init = function() {
    this.__asyncProcess(function(async) {
        setTimeout(
            async(function() {
                this.name = 'manager';
            }),
            10
        );
    });
};
Manager.prototype.selectProvider = function(fileName) {};

var config = {
    dependencies: {
        dep1: require('./module1-danf'),
        dep2: require('./module2-danf'),
        dep3: require('./module3-danf'),
        dep4: require('./module4-danf'),
        'dep2:module10': 'dep1:module10',
        'dep2:module11': 'dep1:module10'
    },
    contract: {
        providers: {
            type: 'embedded_object',
            embed: {
                rules: {
                    type: 'embedded_object',
                    embed: {
                        parameters: {
                            type: 'embedded_array',
                            embed: {
                                type: {
                                    type: 'string'
                                },
                                value: {
                                    type: 'mixed'
                                }
                            }
                        }
                    }
                },
                storages: {
                    type: 'string_array'
                },
                adapter: {
                    type: 'string'
                }
            }
        },
        timeOut: {
            type: 'number'
        }
    },
    config: {
        classes: {
            a: require('./app/a'),
            b: require('./app/b'),
            c: require('./app/c'),
            computer: '%classes.computer%',
            manager: Manager,
            trigger: require('./app/trigger'),
            callbackExecutor: require('./app/callback-executor'),
            interfacedData: require('./app/interfaced-data')
        },
        parameters: {
            'dep1:rule': {
                parameter: {
                    size: 'size'
                }
            },
            adapter: {
                image: 'image'
            },
            classes: {
                computer: require('./app/computer')
            }
        },
        interfaces: {
            ManagerInterface: {
                methods: {
                    selectProvider: {
                        arguments: ['string/fileName']
                    }
                }
            },
            data: {
            }
        },
        services: {
            polymorphous: {
                class: 'c'
            },
            trigger: {
                class: 'trigger',
                properties: {
                    startEvent: '#danf:event.eventsContainer[event][start]#',
                    startDependencyEvent: '#danf:event.eventsContainer[event][dep1:start]#'
                }
            },
            computer: {
                class: '%classes.computer%',
                properties: {
                    counter: '#counter2#',
                    displayer: '#dep1:displayer#'
                }
            },
            manager: {
                class: 'manager',
                properties: {
                    providers: '&provider&',
                    timeOut: '$dep2:timeOut$',
                    manager: '#dep2:manager#'
                }
            },
            provider: {
                class: 'dep1:providerClass',
                declinations: '$providers$',
                properties: {
                    storages: '#storage.@storages@#',
                    adapter: '#@adapter@#'
                },
                collections: ['provider'],
                induced: {
                    rule: {
                        service: 'rule',
                        factory: 'provider',
                        context: '@rules@',
                        property: 'rules',
                        collection: true
                    }
                }
            },
            rule: {
                factories: {
                    provider: {
                        parent: 'rule.@_@',
                        declinations: '!.!',
                        induced: {
                            parameter: {
                                service: 'parameter',
                                factory: 'rule',
                                context: '@parameters@',
                                property: 'parameters',
                                collection: true
                            }
                        }
                    }
                },
                children: {
                    minSize: {
                        class: function() { this.name = 'rule minSize'; this.check = function() { return true; }; },
                        abstract: true
                    },
                    maxSize: {
                        class:  function() { this.name = 'rule maxSize'; this.check = function() { return true; }; },
                        abstract: true
                    }
                }
            },
            adapter: {
                children: {
                    image: {
                        class: function() { this.name = 'adapter image'; }
                    }
                }
            },
            parameter: {
                factories: {
                    rule: {
                        parent: 'parameter.@type@',
                        declinations: '!.!',
                        properties: {
                            value: '@value@'
                        }
                    }
                },
                abstract: true
            },
            'parameter.size': {
                class: function() { this.name = 'parameter size'; },
                abstract: true
            },
            'parameter.unit': {
                class: function() { this.name = 'parameter unit'; },
                abstract: true
            },
            storage: {
                children: {
                    local: {
                        class: function() { this.name = 'local storage'; }
                    },
                    remote: {
                        class: function() { this.name = 'remote storage'; }
                    }
                }
            },
            counter2: {
                alias: 'dep2:module10:counter'
            },
            timer: {
                class: function() { this.name = 'timer'; },
                properties: {
                    timeOut: '$timeOut$',
                    interval: '$dep1:interval$'
                }
            },
            'danf:manipulation.callbackExecutor': {
                class: 'callbackExecutor'
            },
            dataProvider: {
                parent: 'danf:dependencyInjection.objectProvider',
                properties: {
                    class: '[-]interfacedData',
                    interface: '[-]data'
                }
            }
        },
        events: {
            event: {
                start: {
                    context: {
                        value: 2
                    },
                    sequences: [
                        {
                            name: 'initialize'
                        }
                    ]
                },
                happenSomething: {
                    data: {
                        data: {
                            type: 'embedded',
                            default: {},
                            embed: {
                                i: {
                                    type: 'number',
                                    default: 0
                                }
                            }
                        },
                        done: {
                            type: 'function'
                        }
                    },
                    context: {
                        j: 2
                    },
                    callback: function(stream, context) {
                        var expected = stream.data.k + context.j;

                        if (stream.data.k > 1) {
                            expected += 2;
                        } else {
                            expected += 1;
                        }

                        assert.strictEqual(stream.data.i, expected);
                        stream.done();
                    },
                    sequences: [
                        {
                            name: 'doSomething',
                            input: {
                                data: '@data@'
                            },
                            output: {
                                data: '@data@'
                            }
                        }
                    ]
                }
            },
            request: {
                'dep3:api': {
                    parameters: {
                        value: {
                            type: 'number',
                            default: 2
                        }
                    },
                    children: {
                        dec: {
                            path: '/:inc/dec'
                        }
                    }
                }
            }
        },
        sequences: {
            initialize: {
                operations: [
                    {
                        service: 'provider.smallImages',
                        order: 0,
                        method: 'checkRules',
                        arguments: ['dumb.jpg'],
                        scope: 'dumb'
                    },
                    {
                        service: 'danf:manipulation.callbackExecutor',
                        order: 2,
                        method: 'execute',
                        arguments: [
                            function(dumb) {
                                assert.strictEqual(dumb, true);
                            },
                            '@dumb@'
                        ]
                    }
                ]
            },
            doSomething: {
                operations: [
                    {
                        service: 'danf:manipulation.callbackExecutor',
                        order: -1,
                        method: 'execute',
                        arguments: [
                            function(i) {
                                return i;
                            },
                            '@data.i@'
                        ],
                        scope: 'data.k'
                    },
                    {
                        service: 'danf:manipulation.callbackExecutor',
                        order: 0,
                        method: 'execute',
                        arguments: [
                            function(data) {
                                data.i++;
                            },
                            '@data@'
                        ]
                    },
                    {
                        condition: function(stream, context) {
                            var value = stream.data.k + context.j;

                            // Should have no impact on real context.
                            context.j = 10;

                            return value > 3;
                        },
                        service: 'danf:manipulation.callbackExecutor',
                        order: 1,
                        method: 'execute',
                        arguments: [
                            function(i) {
                                return ++i;
                            },
                            '@data.i@'
                        ],
                        scope: 'data.i'
                    },
                    {
                        service: 'danf:manipulation.callbackExecutor',
                        order: 2,
                        method: 'execute',
                        arguments: [
                            function(i, j) {
                                return i + j;
                            },
                            '@data.i@',
                            '!j!'
                        ],
                        scope: 'data.i'
                    }
                ]
            }
        },
        this: {
            providers: {
                smallImages: {
                    rules: {
                        maxSize: {
                            parameters: [{
                                type: '%dep1:rule.parameter.size%',
                                value: '2m'
                            }]
                        }
                    },
                    storages: ['local'],
                    adapter: 'adapter.%adapter.image%'
                },
                bigImages: {
                    rules: {
                        minSize: {
                            parameters: [
                                {
                                    type: '%dep1:rule.parameter.size%',
                                    value: 2
                                }, {
                                    type: 'unit',
                                    value: 'm'
                                }
                            ],
                        },
                        maxSize: {
                            parameters: [
                                {
                                    type: '%dep1:rule.parameter.size%',
                                    value: 10
                                }, {
                                    type: 'unit',
                                    value: 'm'
                                }
                            ],
                        }
                    },
                    storages: ['local', 'remote'],
                    adapter: 'adapter.%adapter.image%'
                }
            },
            timeOut: 2000
        },
        'this/test': {
            timeOut: 2100
        },
        'dep1/test': {
            interval: 20
        }
    }
};

// Test ES6 class.
if (parseFloat(process.version.replace('v', '')) > 2) {
    config.config.classes.d = require('./app/d');
    config.config.classes.e = require('./app/e');
    config.config.interfaces.d = {
        methods: {
            d: {
            }
        }
    };
    config.config.services.es6Polymorphous = {
        class: 'e'
    };
}

module.exports = config;
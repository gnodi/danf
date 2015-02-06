'use strict';

var utils = require('../../lib/utils.js'),
    assert = require('assert')
;

var Manager = function() { this.name = 'manager'; };
Manager.defineImplementedInterfaces(['ManagerInterface']);
Manager.prototype.selectProvider = function(fileName) {};

module.exports = {
    dependencies: {
        dep1: require('./module1-danf'),
        dep2: require('./module2-danf'),
        dep3: require('./module3-danf'),
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
            manager: '%classes.manager%',
            trigger: '%classes.trigger%',
            interfacedData: '%classes.interfacedData%'
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
                manager: Manager,
                computer: require('./app/computer'),
                trigger: require('./app/trigger'),
                callbackExecutor: require('./app/callback-executor'),
                interfacedData: require('./app/interfaced-data')
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
                class: '%classes.trigger%',
                properties: {
                    eventsHandler: '#danf:event.eventsHandler#'
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
                class: '%classes.manager%',
                properties: {
                    providers: '&provider&',
                    timeOut: '$dep2:timeOut$',
                    manager: '#dep2:manager#'
                }
            },
            provider: {
                class: '%dep1:providerClass%',
                declinations: '$providers$',
                properties: {
                    rules: '>rule.@rules@>provider>@@rules.@rules@@@>',
                    storages: '#storage.@storages@#',
                    adapter: '#@adapter@#'
                },
                tags: ['provider']
            },
            rule: {
                factories: {
                    provider: {
                        properties: {
                            parameters: '>parameter.@parameters.type@>rule>@@parameters.@parameters@@@>'
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
            'parameter.size': {
                class: function() { this.name = 'parameter size'; },
                abstract: true,
                factories: {
                    rule: {
                        properties: {
                            value: '@value@'
                        }
                    }
                }
            },
            'parameter.unit': {
                class: function() { this.name = 'parameter unit'; },
                abstract: true,
                factories: {
                    rule: {
                        properties: {
                            value: '@value@'
                        }
                    }
                }
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
                class: '%classes.callbackExecutor%'
            },
            dataProvider: {
                parent: 'danf:dependencyInjection.objectProvider',
                properties: {
                    class: '%classes.interfacedData%',
                    interface: '[-]data'
                }
            },
            currentDataProvider: {
                parent: 'danf:dependencyInjection.contextProvider',
                properties: {
                    interface: '[-]data'
                }
            }
        },
        events: {
            event: {
                start: {
                    context: 2,
                    sequences: ['initialize']
                },
                happenSomething: {
                    contract: {
                        i: {
                            type: 'number',
                            default: 0
                        },
                        k: {
                            type: 'number'
                        },
                        done: {
                            type: 'function'
                        }
                    },
                    context: {
                        j: 2
                    },
                    callback: function(stream) {
                        var expected = stream.data.k + stream.context.j;

                        if (1 <= stream.data.k) {
                            expected += 2;
                        } else {
                            expected += 1;
                        }

                        assert.strictEqual(stream.data.i, expected);
                        stream.data.done();
                    },
                    sequences: ['doSomething']
                }
            }
        },
        sequences: {
            initialize: [
                {
                    service: 'provider.smallImages',
                    method: 'checkRules',
                    arguments: ['dumb.jpg'],
                    returns: 'dumb'
                },
                {
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(dumb) {
                            assert.strictEqual(dumb, true);
                        },
                        '@dumb@'
                    ]
                }
            ],
            doSomething: [
                {
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(data) {
                            data.i++;
                        },
                        '@data@'
                    ]
                },
                {
                    condition: function(stream) {
                        return stream.data.i > 2;
                    },
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(i) {
                            return ++i;
                        },
                        '@data.i@'
                    ],
                    returns: 'data.i'
                },
                {
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(i, j) {
                            return i + j;
                        },
                        '@data.i@',
                        '@context.j@'
                    ],
                    returns: 'data.i'
                }
            ]
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
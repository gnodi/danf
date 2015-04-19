'use strict';

var assert = require('assert');

var Provider = function() { this.name = 'provider'; };
Provider.defineImplementedInterfaces(['ProviderInterface']);
Provider.prototype.checkRules = function(fileName) {
    for (var i = 0; i < this.rules.length; i++) {
        if (!this.rules[i].check()) {
            return false;
        }
    }

    return true;
};

var Displayer = function() { this.name = 'displayer'; };
Displayer.defineImplementedInterfaces(['displayer']);
Displayer.prototype.display = function(counter) { return counter.count };

var Manager = function() { this.name = 'manager'; }
Manager.defineImplementedInterfaces(['module10:manager']);

module.exports = {
    contract: {
        interval: {
            type: 'number',
            default: 30
        }
    },
    dependencies: {
        module10: require('./module10-v1-danf')
    },
    config: {
        parameters: {
            rule: {
                parameter: {
                    size: 'size'
                }
            },
            classes: {
                computer: require('./app/base-computer'),
            }
        },
        classes: {
            computer: '%classes.computer%',
            provider: Provider,
            providerClass: Provider,
            manager: Manager,
            displayer: Displayer,
            trigger: require('./app/trigger1'),
            counter: require('./app/counter'),
            scheduler: require('./app/scheduler')
        },
        interfaces: {
            ProviderInterface: {
                methods: {
                    checkRules: {
                        arguments: ['string/fileName']
                    }
                }
            },
            displayer: {
                methods: {
                    display: {
                        arguments: ['module10:counter/counter']
                    }
                }
            }
        },
        services: {
            displayer: {
                class: Displayer
            },
            manager: {
                class: Manager,
                properties: {
                    timeOut: '$module10:timeOut$',
                    try: '$module10:module100:try$'
                }
            },
            trigger: {
                class: 'trigger',
                properties: {
                    eventsHandler: '#danf:event.eventsHandler#'
                }
            },
            counter: {
                class: 'counter'
            },
            scheduler: {
                class: 'scheduler',
                properties: {
                    currentSequencerProvider: '#danf:event.currentSequencerProvider#'
                }
            },
        },
        sequences: {
            foo: [
                {
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(i) {
                            return i;
                        },
                        '@data.i@'
                    ],
                    returns: 'i'
                },
                {
                    service: 'counter',
                    method: 'inc',
                    arguments: ['@data.i@', 5],
                    returns: 'data.i'
                },
                {
                    service: 'counter',
                    method: 'dec',
                    arguments: ['@data.i@', 2],
                    returns: 'data.i'
                }
            ],
            bar: [
                {
                    service: 'scheduler',
                    method: 'start',
                    arguments: ['@data.i@', 1, 10],
                    returns: 'data.i'
                },
                {
                    service: 'scheduler',
                    method: 'start',
                    arguments: ['@data.i@', 2, 5],
                    returns: 'data.j'
                }
            ],
            end: [
                {
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(i, j, k, done) {
                            assert.equal(i, k + 6);
                            assert.equal(j, k + 12);

                            done();
                        },
                        '@data.i@',
                        '@data.j@',
                        '@i@',
                        '@data.done@'
                    ]
                }
            ]
        },
        events: {
            event: {
                start: {
                    context: 2,
                    sequences: ['foo', 'bar', 'end']
                }
            }
        },
        this: {
            interval: 10
        },
        'this/test': {
            interval: 40
        }
    }
};
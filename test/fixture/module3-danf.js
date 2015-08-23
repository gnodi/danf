'use strict';

function Computer() {}

Computer.prototype.inc = function (value, inc) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(function(value) {
                    return value + inc;
                });
            },
            20
        );
    });
}

module.exports = {
    dependencies: {
        module10: require('./module10-v3-danf')
    },
    config: {
        services: {
            manager: {
                class: function() { this.name = 'manager'; },
                properties: {
                    timeOut: '$module10:timeOut$',
                    try: '$module10:module100:try$'
                }
            },
            computer: {
                class: Computer
            }
        },
        sequences: {
            inc: {
                input: {
                    value: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        service: 'computer',
                        method: 'inc',
                        arguments: ['@value@'],
                        scope: 'value'
                    }
                ]
            },
            incParallel: {
                input: {
                    input: {
                        type: 'number_array'
                    }
                },
                children: [
                    {
                        name: 'inc',
                        input: {
                            value: '@@.@@'
                        },
                        collection: {
                            input: '@input@',
                            method: '||',
                            aggregate: true
                        },
                        output: {
                            result: '@value@'
                        }
                    }
                ]
            }
        },
        events: {
            event: {
                parallelComputing: {
                    parameters: {
                        input: {
                            type: 'number_array'
                        },
                        done: {
                            type: 'function'
                        }
                    },
                    sequences: [
                        {
                            name: 'incParallel',
                            input: {
                                input: '@input@'
                            },
                            output: {
                                result: '@result@'
                            }
                        }
                    ],
                    callback: function(stream) {
                        console.log(stream);
                    }
                }
            }
        }
    }
};
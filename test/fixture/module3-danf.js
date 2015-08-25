'use strict';

var assert = require('assert');

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
                    },
                    inc: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        service: 'computer',
                        method: 'inc',
                        arguments: ['@value@', '@inc@'],
                        scope: 'value'
                    }
                ]
            },
            incParallel: {
                input: {
                    input: {
                        type: 'number_array'
                    },
                    result: {
                        type: 'number',
                        default: 0
                    }
                },
                children: [
                    {
                        name: 'inc',
                        input: {
                            value: '@@.@@',
                            inc: '@result@'
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
            },
            incSeries: {
                input: {
                    input: {
                        type: 'number_array'
                    },
                    result: {
                        type: 'number',
                        default: 0
                    }
                },
                children: [
                    {
                        name: 'inc',
                        input: {
                            value: '@@.@@',
                            inc: '@result@'
                        },
                        collection: {
                            input: '@input@',
                            method: '--',
                            aggregate: true
                        },
                        output: {
                            result: '@value@'
                        }
                    }
                ]
            },
            incParallelLimit: {
                input: {
                    input: {
                        type: 'number_array'
                    },
                    result: {
                        type: 'number',
                        default: 0
                    }
                },
                children: [
                    {
                        name: 'inc',
                        input: {
                            value: '@@.@@',
                            inc: '@result@'
                        },
                        collection: {
                            input: '@input@',
                            method: '|-',
                            parameters: {
                                limit: 2
                            },
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
                        expected: {
                            type: 'number',
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
                    callback: function(error, stream) {
                        assert.equal(stream.result, stream.expected);

                        stream.done();
                    }
                },
                seriesComputing: {
                    parameters: {
                        input: {
                            type: 'number_array'
                        },
                        expected: {
                            type: 'number',
                        },
                        done: {
                            type: 'function'
                        }
                    },
                    sequences: [
                        {
                            name: 'incSeries',
                            input: {
                                input: '@input@'
                            },
                            output: {
                                result: '@result@'
                            }
                        }
                    ],
                    callback: function(error, stream) {
                        assert.equal(stream.result, stream.expected);

                        stream.done();
                    }
                },
                parallelLimitComputing: {
                    parameters: {
                        input: {
                            type: 'number_array'
                        },
                        expected: {
                            type: 'number',
                        },
                        done: {
                            type: 'function'
                        }
                    },
                    sequences: [
                        {
                            name: 'incParallelLimit',
                            input: {
                                input: '@input@'
                            },
                            output: {
                                result: '@result@'
                            }
                        }
                    ],
                    callback: function(error, stream) {
                        assert.equal(stream.result, stream.expected);

                        stream.done();
                    }
                }
            }
        }
    }
};
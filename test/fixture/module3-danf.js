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

Computer.prototype.add = function (value, coeff) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(function(value) {
                    return value + coeff;
                });
            },
            20
        );
    });
}

Computer.prototype.mul = function (value, coeff) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(function(value) {
                    return value * coeff;
                });
            },
            20
        );
    });
}

var assertAsynchronousExpected = function(stream) {
        assert.equal(stream.result, stream.expected);

        stream.done();
    }
;

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
                stream: {
                    value: {
                        type: 'number',
                        required: true
                    },
                    inc: {
                        type: 'number',
                        required: true
                    }
                },
                operations: [
                    {
                        service: 'computer',
                        method: 'inc',
                        arguments: ['@value@', '@inc@'],
                        scope: 'value'
                    }
                ],
                parents: [
                    {
                        order: -1,
                        target: '&inc&',
                        input: {
                            value: '@value@',
                            inc: '@inc@'
                        },
                        output: {
                            value: '@value@'
                        }
                    },
                    {
                        order: 1,
                        target: 'compute',
                        input: {
                            value: '@value@',
                            inc: '@inc@'
                        },
                        output: {
                            value: '@value@'
                        }
                    }
                ]
            },
            mul: {
                stream: {
                    value: {
                        type: 'number',
                        required: true
                    },
                    coeff: {
                        type: 'number',
                        required: true
                    }
                },
                operations: [
                    {
                        service: 'computer',
                        method: 'mul',
                        arguments: ['@value@', '@coeff@'],
                        scope: 'value'
                    }
                ]
            },
            sum: {
                stream: {
                    input: {
                        type: 'number_array',
                        required: true
                    },
                    sum: {
                        type: 'number',
                        default: 0
                    }
                },
                operations: [
                    {
                        service: 'computer',
                        method: 'add',
                        arguments: ['@sum@', '@@.@@'],
                        collection: {
                            input: '@input@',
                            method: '--',
                            aggregate: true
                        },
                        scope: 'sum'
                    }
                ]
            },
            incParallel: {
                stream: {
                    input: {
                        type: 'number_array',
                        required: true
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
                stream: {
                    input: {
                        type: 'number_array',
                        required: true
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
                stream: {
                    input: {
                        type: 'number_array',
                        required: true
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
            },
            compute: {
                stream: {
                    inc: {
                        type: 'number',
                        default: 2
                    },
                    coeff: {
                        type: 'number',
                        default: 3
                    },
                    value: {
                        type: 'number',
                        default: 0
                    }
                },
                operations: [
                    {
                        order: 2,
                        service: 'computer',
                        method: 'mul',
                        arguments: ['@value@', '@coeff@'],
                        scope: 'value'
                    },
                    {
                        order: 3,
                        service: 'computer',
                        method: 'mul',
                        arguments: ['@value@', 2],
                        scope: 'value'
                    },
                    {
                        order: 3,
                        service: 'computer',
                        method: 'mul',
                        arguments: ['@value@', 2],
                        scope: 'value'
                    },
                    {
                        order: 4,
                        service: 'computer',
                        method: 'inc',
                        arguments: ['@value@', 3],
                        scope: 'value'
                    }
                ],
                children: [
                    {
                        order: 0,
                        name: 'mul',
                        input: {
                            value: '@value@',
                            coeff: '@coeff@'
                        },
                        output: {
                            value: '@value@'
                        }
                    },
                    {
                        order: 2,
                        name: 'mul',
                        input: {
                            value: '@value@',
                            coeff: '@coeff@'
                        },
                        output: {
                            value: '@value@'
                        }
                    }
                ],
                collections: ['inc']
            }
        },
        events: {
            event: {
                parallelComputing: {
                    data: {
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
                    callback: assertAsynchronousExpected
                },
                seriesComputing: {
                    data: {
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
                    callback: assertAsynchronousExpected
                },
                parallelLimitComputing: {
                    data: {
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
                    callback: assertAsynchronousExpected
                },
                compute: {
                    data: {
                        expected: {
                            type: 'number'
                        },
                        done: {
                            type: 'function'
                        }
                    },
                    sequences: [
                        {
                            name: 'compute',
                            output: {
                                result: '@value@'
                            }
                        }
                    ],
                    callback: assertAsynchronousExpected
                },
                sum: {
                    data: {
                        input: {
                            type: 'number_array'
                        },
                        expected: {
                            type: 'number'
                        },
                        done: {
                            type: 'function'
                        }
                    },
                    sequences: [
                        {
                            name: 'sum',
                            input: {
                                input: '@input@'
                            },
                            output: {
                                result: '@sum@'
                            }
                        }
                    ],
                    callback: assertAsynchronousExpected
                }
            },
            request: {
                compute: {
                    path: '/computing',
                    methods: ['get'],
                    parameters: {
                        val: {
                            type: 'number',
                            required: true
                        }
                    },
                    sequences: [
                        {
                            name: 'compute',
                            input: {
                                value: '!request.query.val!'
                            },
                            output: {
                                result: '@value@'
                            }
                        }
                    ],
                    view: {
                        json: {
                            select: ['result']
                        }
                    }
                },
                api: {
                    path: '/api/resource',
                    methods: ['get'],
                    parameters: {
                        value: {
                            type: 'number',
                            default: 2
                        }
                    },
                    sequences: [
                        {
                            name: 'add',
                            input: {
                                value: '@value@',
                                inc: '@inc'
                            },
                            output: {
                                result: '@value@'
                            }
                        }
                    ],
                    view: {
                        json: {
                            select: ['result']
                        }
                    },
                    children: {
                        get: {
                            path: '/:id',
                            methods: ['get'],
                            parameters: {
                                inc: {
                                    type: 'number',
                                    default: 1
                                }
                            }
                        },
                        post: {
                            methods: ['post'],
                            parameters: {
                                inc: {
                                    type: 'number',
                                    default: 2
                                }
                            }
                        },
                        alter: {
                            path: '/:id',
                            methods: ['put'],
                            parameters: {
                                inc: {
                                    type: 'number',
                                    default: 3
                                }
                            },
                            children: {
                                put: {
                                },
                                patch: {
                                    methods: ['put']
                                },
                                delete: {
                                    methods: ['delete'],
                                    parameters: {
                                        inc: {
                                            type: 'number',
                                            default: 4
                                        }
                                    }
                                }
                            }
                        },
                        sub: {
                            path: '/:resource-id/sub',
                            children: {
                                get: {
                                    path: '/:sub-id',
                                    methods: ['get'],
                                    parameters: {
                                        inc: {
                                            type: 'number',
                                            default: 5
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
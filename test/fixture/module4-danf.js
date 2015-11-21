'use strict';

// Define class "Computer".
function Computer() {}

Computer.prototype.add = function (value, operand) {
    return value + operand;
}

Computer.prototype.mul = function (value, operand) {
    return value * operand;
}

// Define class "AsyncComputer".
function AsyncComputer() {}

AsyncComputer.prototype.add = function (value, operand) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(value + operand);
            },
            10
        );
    });
}

AsyncComputer.prototype.mul = function (value, operand) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(value * operand);
            },
            10
        );
    });
}

// Define class "ProxyComputer".
function ProxyComputer() {}

Object.defineProperty(ProxyComputer.prototype, 'computer', {
    set: function(computer) { this._computer = computer; }
});

ProxyComputer.prototype.add = function (value, operand, scope) {
    this._computer.add.__asyncCall(
        this._computer,
        scope,
        value,
        operand
    );
}

ProxyComputer.prototype.mul = function (value, operand, scope) {
    this._computer.mul.__asyncApply(
        this._computer,
        scope,
        [value, operand]
    );
}

module.exports = {
    config: {
        classes: {
            computer: Computer,
            asyncComputer: AsyncComputer,
            proxyComputer: ProxyComputer
        },
        services: {
            computer: {
                class: 'computer'
            },
            asyncComputer: {
                class: 'asyncComputer'
            },
            proxyComputer: {
                class: 'proxyComputer',
                properties: {
                    computer: '#asyncComputer#'
                }
            }
        },
        sequences: {
            // Test simple operation.
            add: {
                operations: [
                    {
                        service: 'computer',
                        method: 'add',
                        arguments: [2, 3],
                        scope: 'result'
                    }
                ]
            },
            // Test operation with an input stream value.
            addInputStream: {
                stream: {
                    value: {
                        type: 'number',
                        default: 4
                    }
                },
                operations: [
                    {
                        service: 'computer',
                        method: 'add',
                        arguments: ['@value@', 3],
                        scope: 'result'
                    }
                ]
            },
            // Test async operation.
            addAsync: {
                operations: [
                    {
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: [2, 3],
                        scope: 'result'
                    }
                ]
            },
            // Test multi sync operation.
            addMultiSync: {
                stream: {
                    value: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        service: 'computer',
                        method: 'add',
                        arguments: ['@value@', 3],
                        scope: 'value'
                    },
                    {
                        service: 'computer',
                        method: 'add',
                        arguments: ['@value@', 3],
                        scope: 'value'
                    }
                ]
            },
            // Test multi async parallel operation.
            addMultiAsyncParallel: {
                stream: {
                    value: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: ['@value@', 3],
                        scope: 'value'
                    },
                    {
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: ['@value@', 3],
                        scope: 'value'
                    }
                ]
            },
            // Test multi async series operations.
            addMultiAsyncSeries: {
                stream: {
                    value: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        order: 0,
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: ['@value@', 3],
                        scope: 'value'
                    },
                    {
                        order: 1,
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: ['@value@', 3],
                        scope: 'value'
                    }
                ]
            },
            // Test children.
            computeChildrenParent: {
                stream: {
                    value: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        order: 0,
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: ['@value@', 6],
                        scope: 'value'
                    }
                ],
                children: [
                    {
                        name: 'computeChildrenChild',
                        order: -1,
                        input: {
                            value: '@value@'
                        },
                        output: {
                            value: '@value@'
                        }
                    },
                    {
                        name: 'computeChildrenChild',
                        order: 1,
                        input: {
                            value: '@value@'
                        },
                        output: {
                            value: '@value@'
                        }
                    }
                ]
            },
            computeChildrenChild: {
                stream: {
                    value: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        order: 0,
                        service: 'asyncComputer',
                        method: 'mul',
                        arguments: ['@value@', 2],
                        scope: 'value'
                    }
                ]
            },
            // Test parents.
            computeParentParent: {
                stream: {
                    value: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        order: 0,
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: ['@value@', 6],
                        scope: 'value'
                    }
                ],
                parents: [
                    {
                        target: 'computeParentChildName',
                        order: -1,
                        input: {
                            value: '@value@'
                        },
                        output: {
                            value: '@value@'
                        }
                    },
                    {
                        target: '&parentChild&',
                        order: 1,
                        input: {
                            value: '@value@'
                        },
                        output: {
                            value: '@value@'
                        }
                    }
                ]
            },
            computeParentChildName: {
                stream: {
                    value: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        order: 0,
                        service: 'asyncComputer',
                        method: 'mul',
                        arguments: ['@value@', 2],
                        scope: 'value'
                    }
                ],
                collections: ['parentChild']
            },
            computeParentChildCollection: {
                stream: {
                    value: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        order: 0,
                        service: 'asyncComputer',
                        method: 'mul',
                        arguments: ['@value@', 2],
                        scope: 'value'
                    }
                ],
                collections: ['parentChild']
            },
            // Test operation on collection.
            addCollectionParallel: {
                stream: {
                    value: {
                        type: 'number_array'
                    }
                },
                operations: [
                    {
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: ['@@.@@', 2],
                        collection: {
                            input: '@value@',
                            method: '||'
                        },
                        scope: 'value'
                    }
                ]
            },
            addCollectionSeries: {
                stream: {
                    value: {
                        type: 'number_array'
                    },
                    result: {
                        type: 'number',
                        default: 2
                    }
                },
                operations: [
                    {
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: ['@@.@@', '@result@'],
                        collection: {
                            input: '@value@',
                            method: '--',
                            aggregate: true
                        },
                        scope: 'result'
                    }
                ]
            },
            addCollectionAggregate: {
                stream: {
                    value: {
                        type: 'number_array'
                    }
                },
                operations: [
                    {
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: ['@@.@@', 2],
                        collection: {
                            input: '@value@',
                            method: '|-',
                            parameters: {
                                limit: 2
                            },
                            aggregate: function(value) {
                                var aggregatedValue = 1;

                                for (var i = 0; i < value.length; i++) {
                                    aggregatedValue *= value[i];
                                }

                                return aggregatedValue;
                            }
                        },
                        scope: 'result'
                    }
                ]
            },
            // Test operation with an input context value.
            addInputContext: {
                stream: {
                    value: {
                        type: 'number'
                    }
                },
                operations: [
                    {
                        service: 'computer',
                        method: 'add',
                        arguments: ['@value@', '!operand!'],
                        scope: 'result'
                    }
                ]
            },
            // Test proxy.
            addProxy: {
                operations: [
                    {
                        service: 'proxyComputer',
                        method: 'add',
                        arguments: [2, 3, '.'],
                        scope: 'result'
                    }
                ]
            },
            // Test scoped proxy.
            addProxyScope: {
                operations: [
                    {
                        service: 'proxyComputer',
                        method: 'add',
                        arguments: [2, 3, 'value'],
                        scope: 'result'
                    }
                ]
            },
            // Test embedded scope.
            addEmbeddedScope: {
                operations: [
                    {
                        service: 'asyncComputer',
                        method: 'add',
                        arguments: [2, 3],
                        scope: 'result.value'
                    }
                ]
            },
            // Test sequence alias.
            addAlias: {
                alias: 'add'
            }
        }
    }
};
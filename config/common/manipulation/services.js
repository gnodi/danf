'use strict';

module.exports = {
    escaper: {
        class: 'danf:manipulation.escaper'
    },
    uniqueIdGenerator: {
        class: 'danf:manipulation.uniqueIdGenerator'
    },
    referenceResolver: {
        class: 'danf:manipulation.referenceResolver',
        properties: {
            referenceTypes: '&danf:manipulation.referenceType&'
        }
    },
    referenceType: {
        tags: ['danf:manipulation.referenceType'],
        class: 'danf:manipulation.referenceType',
        children: {
            parameter: {
                properties: {
                    name: '%',
                    delimiter: '%'
                }
            },
            context: {
                properties: {
                    name: '@',
                    delimiter: '@'
                }
            },
            globalContext: {
                properties: {
                    name: '!',
                    delimiter: '!'
                }
            },
            memory: {
                properties: {
                    name: '~',
                    delimiter: '~'
                }
            }
        }
    },
    dataResolver: {
        class: 'danf:manipulation.dataResolver',
        properties: {
            dataInterpreters: '&danf:manipulation.dataInterpreter&'
        }
    },
    dataInterpreter: {
        tags: ['danf:manipulation.dataInterpreter'],
        children: {
            default: {
                class: 'danf:manipulation.dataInterpreter.default'
            },
            flatten: {
                class: 'danf:manipulation.dataInterpreter.flatten'
            },
            format: {
                class: 'danf:manipulation.dataInterpreter.format'
            },
            required: {
                class: 'danf:manipulation.dataInterpreter.required'
            },
            type: {
                class: 'danf:manipulation.dataInterpreter.type'
            },
            validate: {
                class: 'danf:manipulation.dataInterpreter.validate'
            }
        }
    },
    callbackExecutor: {
        class: 'danf:manipulation.callbackExecutor'
    },
    mapProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:manipulation.map',
            interface: 'danf:manipulation.map'
        }
    },
    flowDriver: {
        class: 'danf:manipulation.flowDriver',
        properties: {
            async: '#danf:vendor.async#'
        }
    },
    flowProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:manipulation.flow',
            interface: 'danf:manipulation.flow'
        }
    },
    asynchronousCallback: {
        tags: ['danf:manipulation.asynchronousCallback'],
        children: {
            error: {
                class: 'danf:manipulation.asynchronousCallback.error'
            },
            errorResult: {
                class: 'danf:manipulation.asynchronousCallback.errorResult'
            },
            result: {
                class: 'danf:manipulation.asynchronousCallback.result'
            }
        }
    },
    asynchronousInput: {
        tags: ['danf:manipulation.asynchronousInput'],
        children: {
            array: {
                class: 'danf:manipulation.asynchronousInput.array'
            },
            object: {
                class: 'danf:manipulation.asynchronousInput.object'
            }
        }
    },
    asynchronousIterator: {
        tags: ['danf:manipulation.asynchronousIterator'],
        children: {
            collection: {
                class: 'danf:manipulation.asynchronousIterator.collection'
            },
            key: {
                class: 'danf:manipulation.asynchronousIterator.key'
            },
            memo: {
                class: 'danf:manipulation.asynchronousIterator.memo'
            }
        }
    },
    asynchronousCollection: {
        class: 'danf:manipulation.asynchronousCollection',
        tags: ['danf:manipulation.asynchronousCollection'],
        children: {
            each: {
                properties: {
                    method: 'each',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.error#'
                }
            },
            eachSeries: {
                properties: {
                    method: 'eachSeries',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.error#'
                }
            },
            eachLimit: {
                properties: {
                    method: 'eachLimit',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.error#',
                    parameters: {
                        limit: 1
                    }
                }
            },
            forEachOf: {
                properties: {
                    method: 'forEachOf',
                    alias: '||',
                    input: '#danf:manipulation.asynchronousInput.object#',
                    iterator: '#danf:manipulation.asynchronousIterator.key#',
                    callback: '#danf:manipulation.asynchronousCallback.error#'
                }
            },
            forEachOfSeries: {
                properties: {
                    method: 'forEachOfSeries',
                    alias: '--',
                    input: '#danf:manipulation.asynchronousInput.object#',
                    iterator: '#danf:manipulation.asynchronousIterator.key#',
                    callback: '#danf:manipulation.asynchronousCallback.error#'
                }
            },
            forEachOfLimit: {
                properties: {
                    method: 'forEachOfLimit',
                    alias: '|-',
                    input: '#danf:manipulation.asynchronousInput.object#',
                    iterator: '#danf:manipulation.asynchronousIterator.key#',
                    callback: '#danf:manipulation.asynchronousCallback.error#',
                    parameters: {
                        limit: 1
                    }
                }
            },
            map: {
                properties: {
                    method: 'map',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.errorResult#'
                }
            },
            mapSeries: {
                properties: {
                    method: 'mapSeries',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.errorResult#'
                }
            },
            mapLimit: {
                properties: {
                    method: 'mapLimit',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.errorResult#',
                    parameters: {
                        limit: 1
                    }
                }
            },
            filter: {
                properties: {
                    method: 'filter',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.result#'
                }
            },
            filterSeries: {
                properties: {
                    method: 'filterSeries',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.result#'
                }
            },
            reject: {
                properties: {
                    method: 'reject',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.result#'
                }
            },
            rejectSeries: {
                properties: {
                    method: 'rejectSeries',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.result#'
                }
            },
            reduce: {
                properties: {
                    method: 'reduce',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.memo#',
                    callback: '#danf:manipulation.asynchronousCallback.errorResult#',
                    parameters: {
                        memo: 1
                    }
                }
            },
            reduceRight: {
                properties: {
                    method: 'reduceRight',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.memo#',
                    callback: '#danf:manipulation.asynchronousCallback.errorResult#',
                    parameters: {
                        memo: 1
                    }
                }
            },
            detect: {
                properties: {
                    method: 'detect',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.result#'
                }
            },
            detectSeries: {
                properties: {
                    method: 'detectSeries',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.result#'
                }
            },
            sortBy: {
                properties: {
                    method: 'sortBy',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.errorResult#'
                }
            },
            some: {
                properties: {
                    method: 'some',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.result#'
                }
            },
            every: {
                properties: {
                    method: 'every',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.result#'
                }
            },
            concat: {
                properties: {
                    method: 'concat',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.errorResult#'
                }
            },
            concatSeries: {
                properties: {
                    method: 'concatSeries',
                    input: '#danf:manipulation.asynchronousInput.array#',
                    iterator: '#danf:manipulation.asynchronousIterator.collection#',
                    callback: '#danf:manipulation.asynchronousCallback.errorResult#'
                }
            }
        }
    }
};
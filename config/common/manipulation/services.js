'use strict';

module.exports = {
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
            flatten: {
                class: 'danf:manipulation.dataInterpreter.flatten'
            },
            default: {
                class: 'danf:manipulation.dataInterpreter.default'
            },
            required: {
                class: 'danf:manipulation.dataInterpreter.required'
            },
            type: {
                class: 'danf:manipulation.dataInterpreter.type'
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
    sequencerProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:manipulation.sequencer',
            interface: 'danf:manipulation.sequencer'
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
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.error'
                }
            },
            eachSeries: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.error'
                }
            },
            eachLimit: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.error',
                    parameters: {
                        limit: 1
                    }
                }
            },
            forEachOf: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.object',
                    iterator: 'danf:manipulation.asynchronousIterator.key',
                    callback: 'danf:manipulation.asynchronousCallback.error'
                }
            },
            forEachOfSeries: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.object',
                    iterator: 'danf:manipulation.asynchronousIterator.key',
                    callback: 'danf:manipulation.asynchronousCallback.error'
                }
            },
            forEachOfLimit: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.object',
                    iterator: 'danf:manipulation.asynchronousIterator.key',
                    callback: 'danf:manipulation.asynchronousCallback.error',
                    parameters: {
                        limit: 1
                    }
                }
            },
            map: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.errorResult'
                }
            },
            mapSeries: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.errorResult'
                }
            },
            mapLimit: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.errorResult',
                    parameters: {
                        limit: 1
                    }
                }
            },
            filter: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.result'
                }
            },
            filterSeries: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.result'
                }
            },
            reject: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.result'
                }
            },
            rejectSeries: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.result'
                }
            },
            reduce: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.memo',
                    callback: 'danf:manipulation.asynchronousCallback.errorResult',
                    parameters: {
                        memo: 1
                    }
                }
            },
            reduceRight: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.memo',
                    callback: 'danf:manipulation.asynchronousCallback.errorResult',
                    parameters: {
                        memo: 1
                    }
                }
            },
            detect: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.result'
                }
            },
            detectSeries: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.result'
                }
            },
            sortBy: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.errorResult'
                }
            },
            some: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.result'
                }
            },
            every: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.result'
                }
            },
            concat: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.errorResult'
                }
            },
            concatSeries: {
                properties: {
                    input: 'danf:manipulation.asynchronousInput.array',
                    iterator: 'danf:manipulation.asynchronousIterator.collection',
                    callback: 'danf:manipulation.asynchronousCallback.errorResult'
                }
            }
        }
    }
};
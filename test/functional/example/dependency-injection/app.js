'use strict';

var danf = require('../../../..');

danf(
    {
        config: {
            classes: {
                processor: {
                    // "adder" and "multiplier" inherit from "abstract".
                    // You can see how it works in the details of the classes below.
                    abstract: require('./abstract-processor'),
                    adder: require('./adder'),
                    multiplier: require('./multiplier')
                },
                parser: require('./parser'),
                computer: require('./computer')
            },
            interfaces: {
                computer: {
                    methods: {
                        compute: {
                            arguments: ['string/operation'],
                            returns: 'string'
                        }
                    }
                },
                processor: {
                    methods: {
                        process: {
                            arguments: ['number/operand1', 'number/operand2'],
                            returns: 'number'
                        }
                    },
                    getters: {
                        operation: 'string'
                    }
                },
                parser: {
                    methods: {
                        parse: {
                            arguments: ['string/operation'],
                            returns: 'string_array'
                        }
                    }
                }
            },
            services: {
                processor: {
                    tags: ['processor'],
                    // Define children services which will inherit the tag.
                    // This feature is mainly used to improve readability.
                    // The names of the services are "processor.adder" and "processor.multiplier".
                    children: {
                        adder: {
                            class: 'processor.adder'
                        },
                        multiplier: {
                            class: 'processor.multiplier'
                        }
                    }
                },
                parser: {
                    class: 'parser'
                },
                computer: {
                    class: 'computer',
                    // Set the properties of the service "computer".
                    properties: {
                        // Inject in the property "parser" the service "parser".
                        parser: '#parser#',
                        // Inject in the property "processors" the services tagged with "processor".
                        processors: '&processor&'
                    }
                }
            },
            sequences: {
                computeOperation: [
                    {
                        service: 'computer',
                        method: 'compute',
                        arguments: ['@operation@'],
                        returns: 'result'
                    }
                ]
            },
            events: {
                request: {
                    hello: {
                        path: '/',
                        methods: ['get'],
                        parameters: {
                            operation: {
                                type: 'string',
                                required: true
                            }
                        },
                        view: {
                            html: {
                                body: {
                                    file: __dirname + '/index.jade'
                                }
                            }
                        },
                        sequences: ['computeOperation']
                    }
                }
            }
        }
    },
    {
        environment: 'prod',
        debug: false
    },
    {
        environment: 'prod',
        debug: false
    }
);
'use strict';

var danf = require('../../../..');

danf({
    config: {
        // Declaration of the class.
        classes: {
            uppercaser: require('./uppercaser')
        },
        // Definition of the interface implemented by this class.
        interfaces: {
            wordProcessor: {
                methods: {
                    process: {
                        arguments: ['string/word'],
                        returns: 'string'
                    }
                }
            }
        },
        // Definition of a service using this class.
        services: {
            uppercaser: {
                class: 'uppercaser'
            }
        },
        // Definition of a sequence using this service.
        sequences: {
            uppercaseName: [
                // Pass the field "name" of the input stream as first argument
                // to the method "process" of the service "uppercaser".
                {
                    service: 'uppercaser',
                    method: 'process',
                    arguments: ['@name@'],
                    returns: 'name'
                }
            ]
        },
        // Definition of an event of kind HTTP request using this sequence.
        events: {
            request: {
                hello: {
                    path: '/',
                    methods: ['get'],
                    // Description of expected input stream coming from requests.
                    parameters: {
                        name: {
                            type: 'string',
                            default: 'world'
                        }
                    },
                    // Definition of the used view.
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/hello.jade'
                            }
                        }
                    },
                    // Description of the executed sequences.
                    sequences: ['uppercaseName']
                }
            }
        }
    }
});
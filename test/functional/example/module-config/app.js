'use strict';

var danf = require('../../../..');

danf(
    {
        // Define the contract that the config of your danf module must respect.
        contract: {
            helloMessage: {
                type: 'string',
                default: 'world'
            }
        },
        config: {
            // Define your config.
            this: {
                helloMessage: 'everybody'
            },
            sequences: {
                getHelloMessage: [
                    {
                        // Danf's service allowing to execute a callback.
                        // Just use it for tests.
                        service: 'danf:manipulation.callbackExecutor',
                        method: 'execute',
                        arguments: [
                            function(message) {
                                return message;
                            },
                            // Inject the config field "helloMessage".
                            // You can use this to do the same in a property of a service.
                            '$helloMessage$'
                        ],
                        returns: 'message'
                    }
                ]
            },
            events: {
                request: {
                    hello: {
                        path: '/',
                        methods: ['get'],
                        view: {
                            html: {
                                body: {
                                    file: __dirname + '/hello.jade'
                                }
                            }
                        },
                        sequences: ['getHelloMessage']
                    }
                }
            }
        }
    },
    null,
    {
        environment: 'prod',
        debug: false
    },
    {
        environment: 'prod',
        debug: false
    }
);
'use strict';

module.exports = {
    config: {
        interfaces: {
            displayer: {
                methods: {
                    display: {}
                }
            }
        },
        classes: {
            displayer: require('./displayer')
        },
        services: {
            displayer: {
                class: 'displayer',
                properties: {
                    jquery: '#danf:vendor.jquery#'
                }
            }
        },
        events: {
            dom: {
                helloWorld: {
                    event: 'ready',
                    sequences: [
                        {
                            name: 'displayHelloWorld'
                        }
                    ]
                }
            }
        },
        sequences: {
            displayHelloWorld: {
                operations: [
                    {
                        service: 'displayer',
                        method: 'display'
                    }
                ]
            }
        }
    }
};
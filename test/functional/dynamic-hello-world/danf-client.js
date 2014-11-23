'use strict';

define(function(require) {
    return {
        config: {
            parameters: {
                classes: {
                    displayer: require('hello-world/displayer')
                }
            },
            interfaces: {
                displayer: {
                    methods: {
                        display: {}
                    }
                }
            },
            classes: '%classes%',
            services: {
                displayer: {
                    class: '%classes.displayer%',
                    properties: {
                        jquery: '#danf:vendor.jquery#'
                    }
                }
            },
            events: {
                dom: {
                    helloWorld: {
                        event: 'ready',
                        sequences: ['displayHelloWorld']
                    }
                }
            },
            sequences: {
                displayHelloWorld: [{
                    service: 'displayer',
                    method: 'display'
                }]
            }
        }
    };
});
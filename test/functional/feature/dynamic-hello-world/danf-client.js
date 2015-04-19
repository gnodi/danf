'use strict';

define(function(require) {
    return {
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
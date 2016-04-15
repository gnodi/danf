'use strict';

module.exports = {
    server: {
        configuration: 'auto',
        context: {
            environment: 'prod',
            debug: false,
            verbosity: 1
        }
    },
    client: {
        configuration: 'auto',
        context: {
            environment: 'prod',
            debug: false,
            verbosity: 1,
            secret: 'test'
        }
    }
};
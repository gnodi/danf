'use strict';

var danf = require('../../../..');

danf(
    __dirname + '/danf-server.js',
    __dirname + '/danf-client.js',
    // Define server context.
    {
        environment: 'prod',
        debug: false
    },
    // Define client context.
    {
        environment: 'prod',
        debug: false
    }
);
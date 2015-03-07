'use strict';

var danf = require('../../../..');

danf(
    require('./danf'),
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
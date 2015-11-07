'use strict';

var danf = require('danf'),
    app = danf(
        __dirname + '/danf-server.js',
        __dirname + '/danf-client.js',
        {
            environment: 'prod',
            debug: false,
            secret: '<%= app.secret %>'
        },
        {
            environment: 'prod',
            debug: false
        }
    )
;
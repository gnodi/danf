'use strict';

var danf = require('danf'),
    app = danf(
        require(__dirname + '/danf'),
        {
            environment: 'prod',
            debug: false
            secret: 'Change me'
        },
        {
            environment: 'prod',
            debug: false
        }
    )
;
'use strict';

var danf = require('../../../..')(
        __dirname + '/danf-server.js',
        __dirname + '/danf-client.js',
        {},
        {}
    )
;

danf.buildServer(function(app) {
    app.listen();
});
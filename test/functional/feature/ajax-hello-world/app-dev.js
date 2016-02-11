'use strict';

module.exports = {
    server: {
        configuration: __dirname + '/config-server.js',
        context: {}
    },
    client: {
        configuration: __dirname + '/config-client.js',
        context: {
            verbosity: 2
        }
    }
};
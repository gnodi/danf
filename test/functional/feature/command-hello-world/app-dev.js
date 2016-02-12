'use strict';

module.exports = {
    server: {
        configuration: __dirname + '/config-server.js',
        context: {
            verbosity: 1
        }
    },
    client: {
        configuration: __dirname + '/config-client.js',
        context: {
            verbosity: 1
        }
    }
};
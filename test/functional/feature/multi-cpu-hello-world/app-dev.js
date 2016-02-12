'use strict';

module.exports = {
    server: {
        configuration: __dirname + '/config-server.js',
        context: {
            cluster: {
                workers: {
                    http: 3,
                    command: 2
                }
            }
        }
    },
    client: {
        configuration: {},
        context: {}
    }
};
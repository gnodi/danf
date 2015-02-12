'use strict';

module.exports = {
    // The assets are the rules defining which files are accessible from HTTP requests.
    assets: {
        // Define the path for "danf-client".
        // You always need to define this path.
        'danf-client': __dirname + '/danf-client',
        // Map "my-app" to the current directory.
        // The URL path "/my-app/client-config" will give the file "client-config.js".
        'my-app': __dirname,
        // Forbid access to the file "server-config".
        '!my-app/server-config': __dirname + '/server-config.js'
    },
    // The definition of the classes is a little bit different for the client and the server.
    classes: {
        logger: require('./logger')
    },
    // Log on the HTTP request of path "/".
    events: {
        request: {
            index: {
                path: '/',
                methods: ['get'],
                view: {
                    html: {
                        body: {
                            file: __dirname + '/index.jade'
                        }
                    }
                },
                sequences: ['logDanf']
            }
        }
    }
};
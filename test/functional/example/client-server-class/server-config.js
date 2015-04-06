'use strict';

module.exports = {
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
'use strict';

module.exports = {
    config: {
        events: {
            request: {
                helloWorld: {
                    path: '',
                    methods: ['get'],
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/index.jade'
                            }
                        }
                    }
                }
            }
        },
        assets: {
            'danf-client': __dirname + '/danf-client',
            'hello-world': __dirname
        }
    }
};
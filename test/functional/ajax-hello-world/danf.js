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
                    },
                },
                hello: {
                    path: '/hello',
                    methods: ['get'],
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/hello.jade'
                            }
                        }
                    },
                },
                world: {
                    path: '/world',
                    methods: ['get'],
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/world.jade'
                            }
                        }
                    },
                }
            }
        },
        assets: {
            'danf-client': __dirname + '/danf-client',
            'hello-world': __dirname
        }
    }
};
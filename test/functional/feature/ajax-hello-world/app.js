'use strict';

var danf = require('../../../..'),
    app = danf(
        // SERVER.
        {
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
                }
            }
        },
        // CLIENT.
        {
            config: {
                events: {
                    request: {
                        hello: {
                            path: '/hello',
                            methods: ['get']
                        },
                        world: {
                            path: '/world',
                            methods: ['get']
                        }
                    }
                }
            }
        }
    )
;

/*var danf = require('../../../..'),
    app = danf(
        __dirname + '/danf-server.js',
        __dirname + '/danf-client.js'
    )
;*/
'use strict';

var utils = require('../../../../lib/common/utils');

module.exports = utils.merge(
    require('./config-common'),
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
                        }
                    },
                    hello: {
                        view: {
                            html: {
                                body: {
                                    file: __dirname + '/hello.jade'
                                }
                            }
                        }
                    },
                    world: {
                        view: {
                            html: {
                                body: {
                                    file: __dirname + '/world.jade'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    true
);
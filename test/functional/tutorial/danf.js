'use strict';

var utils = require('danf/lib/utils');

module.exports = {
    dependencies: {
    },
    contract: {
        frameworks: {
            type: 'string_array'
        },
        questions: {
            type: 'embedded',
            embed: {
                directory: {
                    type: 'string'
                },
                categories: {
                    type: 'embedded',
                    embed: {
                        dumb: {
                            type: 'embedded_object',
                            embed: {
                                boost: {
                                    type: 'number'
                                },
                                questions: {
                                    type: 'string_object'
                                }
                            }
                        },
                        useless: {
                            type: 'embedded_object',
                            embed: {
                                boost: {
                                    type: 'number'
                                },
                                questions: {
                                    type: 'string_object'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    config: {
        assets: utils.merge(
            {
                'danf-client': __dirname + '/danf-client',
                'tutorial/config': __dirname + '/config',
                '!tutorial/config/server': __dirname + '/config/server',
                'tutorial/lib': __dirname + '/lib',
                '!tutorial/lib/server': __dirname + '/lib/server',
                'tutorial/public': __dirname + '/resources/public',
                '!tutorial/private': __dirname + '/resources/private',
                'favicon.png': __dirname + '/favicon.png'
            },
            require('./config/server/assets'),
            true
        ),
        classes: require('./config/classes'),
        events: utils.merge(
            require('./config/events'),
            require('./config/server/events'),
            true
        ),
        interfaces: utils.merge(
            require('./config/interfaces'),
            require('./config/server/interfaces'),
            true
        ),
        parameters: utils.merge(
            {
                view: {
                    path: __dirname + '/resources/private/view'
                }
            },
            require('./config/parameters'),
            require('./config/server/parameters'),
            true
        ),
        sequences: utils.merge(
            require('./config/sequences'),
            require('./config/server/sequences'),
            true
        ),
        services: utils.merge(
            require('./config/services'),
            require('./config/server/services'),
            true
        ),
        this: utils.merge(
            require('./config/this'),
            require('./config/server/this'),
            true
        )
    }
};
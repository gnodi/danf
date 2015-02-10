'use strict';

var utils = require('danf/lib/utils');

module.exports = {
    dependencies: {
    },
    contract: {
    },
    config: {
        assets: utils.merge(
            {
                'danf-client': __dirname + '/danf-client',
                'my-app/config': __dirname + '/config',
                '!my-app/config/server': __dirname + '/config/server',
                'my-app/lib': __dirname + '/lib',
                '!my-app/lib/server': __dirname + '/lib/server',
                'my-app/public': __dirname + '/resources/public',
                '!my-app/private': __dirname + '/resources/private',
                'favicon.png': __dirname + '/favicon.png'
            },
            require('./config/server/assets'),
            true
        ),
        classes: require('./config/server/classes'),
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
'use strict';

define(function(require) {
    var utils = require('danf/utils');

    return {
        dependencies: {
        },
        contract: {
        },
        config: {
            classes: require('my-app/config/client/classes'),
            events: utils.merge(
                require('my-app/config/events'),
                require('my-app/config/client/events'),
                true
            ),
            interfaces: utils.merge(
                require('my-app/config/interfaces'),
                require('my-app/config/client/interfaces'),
                true
            ),
            parameters: utils.merge(
                require('my-app/config/parameters'),
                require('my-app/config/client/parameters'),
                true
            ),
            sequences: utils.merge(
                require('my-app/config/sequences'),
                require('my-app/config/client/sequences'),
                true
            ),
            services: utils.merge(
                require('my-app/config/services'),
                require('my-app/config/client/services'),
                true
            ),
            this: utils.merge(
                require('my-app/config/this'),
                require('my-app/config/client/this'),
                true
            )
        }
    };
});
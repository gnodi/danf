'use strict';

define(function(require) {
    var utils = require('danf/utils');

    return {
        dependencies: {
        },
        contract: {
        },
        config: {
            classes: require('tutorial/config/client/classes'),
            events: utils.merge(
                require('tutorial/config/events'),
                require('tutorial/config/client/events'),
                true
            ),
            interfaces: utils.merge(
                require('tutorial/config/interfaces'),
                require('tutorial/config/client/interfaces'),
                true
            ),
            parameters: utils.merge(
                require('tutorial/config/parameters'),
                require('tutorial/config/client/parameters'),
                true
            ),
            sequences: utils.merge(
                require('tutorial/config/sequences'),
                require('tutorial/config/client/sequences'),
                true
            ),
            services: utils.merge(
                require('tutorial/config/services'),
                require('tutorial/config/client/services'),
                true
            ),
            this: utils.merge(
                require('tutorial/config/this'),
                require('tutorial/config/client/this'),
                true
            )
        }
    };
});
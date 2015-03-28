'use strict';

define(function(require) {
    var utils = require('danf/lib/common/utils'),
        config = utils.merge(
            require('./config/common/this'),
            require('./config/client/this'),
            true
        )
    ;

    return {
        dependencies: config.dependencies || {},
        contract: config.contract || {},
        config: {
            classes: require('./config/client/classes'),
            events: require('./config/client/events'),
            interfaces: utils.merge(
                require('./config/common/interfaces'),
                require('./config/client/interfaces'),
                true
            ),
            parameters: utils.merge(
                require('./config/common/parameters'),
                require('./config/client/parameters'),
                true
            ),
            sequences: utils.merge(
                require('./config/common/sequences'),
                require('./config/client/sequences'),
                true
            ),
            services: utils.merge(
                require('./config/common/services'),
                require('./config/client/services'),
                true
            ),
            this: config.config || {}
        }
    };
});
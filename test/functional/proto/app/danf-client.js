'use strict';

define(function(require) {
    var utils = require('-/danf/lib/common/utils'),
        config = utils.merge(
            require('-/my-app/config/common/this'),
            require('-/my-app/config/client/this'),
            true
        )
    ;

    return {
        dependencies: config.dependencies || {},
        contract: config.contract || {},
        config: {
            classes: require('-/my-app/config/client/classes'),
            events: require('-/my-app/config/client/events'),
            interfaces: utils.merge(
                require('-/my-app/config/common/interfaces'),
                require('-/my-app/config/client/interfaces'),
                true
            ),
            parameters: utils.merge(
                require('-/my-app/config/common/parameters'),
                require('-/my-app/config/client/parameters'),
                true
            ),
            sequences: utils.merge(
                require('-/my-app/config/common/sequences'),
                require('-/my-app/config/client/sequences'),
                true
            ),
            services: utils.merge(
                require('-/my-app/config/common/services'),
                require('-/my-app/config/client/services'),
                true
            ),
            this: config.config || {}
        }
    };
});
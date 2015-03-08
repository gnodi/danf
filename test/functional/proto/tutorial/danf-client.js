'use strict';

define(function(require) {
    var utils = require('-/danf/lib/common/utils'),
        config = utils.merge(
            require('-/tutorial/config/common/this'),
            require('-/tutorial/config/client/this'),
            true
        )
    ;

    return {
        dependencies: config.dependencies || {},
        contract: config.contract || {},
        config: {
            classes: require('-/tutorial/config/client/classes'),
            events: require('-/tutorial/config/client/events'),
            interfaces: utils.merge(
                require('-/tutorial/config/common/interfaces'),
                require('-/tutorial/config/client/interfaces'),
                true
            ),
            parameters: utils.merge(
                require('-/tutorial/config/common/parameters'),
                require('-/tutorial/config/client/parameters'),
                true
            ),
            sequences: utils.merge(
                require('-/tutorial/config/common/sequences'),
                require('-/tutorial/config/client/sequences'),
                true
            ),
            services: utils.merge(
                require('-/tutorial/config/common/services'),
                require('-/tutorial/config/client/services'),
                true
            ),
            this: config.config || {}
        }
    };
});
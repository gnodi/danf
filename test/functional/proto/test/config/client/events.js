'use strict';

define(function(require) {
    var utils = require('-/danf/lib/common/utils');

    return {
        dom: require('-/my-app/config/client/events/dom'),
        event: utils.merge(
            require('-/my-app/config/common/events/event'),
            require('-/my-app/config/client/events/event'),
            true
        )
    };
});
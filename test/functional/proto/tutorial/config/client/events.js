'use strict';

define(function(require) {
    var utils = require('-/danf/lib/common/utils');

    return {
        dom: require('-/tutorial/config/client/events/dom'),
        event: utils.merge(
            require('-/tutorial/config/common/events/event'),
            require('-/tutorial/config/client/events/event'),
            true
        )
    };
});
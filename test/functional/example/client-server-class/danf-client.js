'use strict';

define(function(require) {
    var utils = require('-/danf/lib/common/utils');

    return {
        // Merge common and client config.
        config: utils.merge(
            require('-/my-app/common-config'),
            require('-/my-app/client-config'),
            true
        )
    };
});
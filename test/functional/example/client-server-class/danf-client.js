'use strict';

var utils = require('../../../../lib/common/utils');

module.exports = {
    config: utils.merge(
        // Merge common and client config.
        require('./common-config'),
        require('./client-config'),
        true
    )
};
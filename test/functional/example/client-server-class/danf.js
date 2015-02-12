'use strict';

var utils = require('../../../../lib/utils');

module.exports = {
    config: utils.merge(
        // Merge common and server config.
        require('./common-config'),
        require('./server-config'),
        true
    )
};
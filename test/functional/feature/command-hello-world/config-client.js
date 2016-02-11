'use strict';

var utils = require('../../../../lib/common/utils');

module.exports = utils.merge(
    require('./config-common'),
    {},
    true
);
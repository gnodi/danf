'use strict';

var utils = require('../../utils');

module.exports = {
    request: require('./events/request'),
    event: utils.merge(
        require('../common/events/event'),
        require('./events/event'),
        true
    )
};
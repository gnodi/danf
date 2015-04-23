'use strict';

var utils = require('../../utils');

module.exports = {
    dom: require('./events/dom'),
    event: utils.merge(
        require('../common/events/event'),
        require('./events/event'),
        true
    )
};
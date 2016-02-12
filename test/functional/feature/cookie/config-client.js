'use strict';

var utils = require('../../../../lib/common/utils');

module.exports = utils.merge(
    require('./config-common'),
    {
        config: {
            events: {
                dom: {
                    ready: {
                        event: 'ready',
                        sequences: [
                            {
                                name: 'testCookie'
                            }
                        ]
                    }
                }
            }
        }
    },
    true
);
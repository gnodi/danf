'use strict';

var utils = require('../../../../lib/common/utils');

module.exports = utils.merge(
    require('./config-common'),
    {
        config: {
            events: {
                request: {
                    home: {
                        path: '/',
                        methods: ['get'],
                        view: {
                            html: {
                                body: {
                                    file: __dirname + '/index.jade'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    true
);
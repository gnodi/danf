'use strict';

var utils = require('../../../../lib/common/utils');

function CookieTester() {
};

CookieTester.prototype.test = function() {
    this._cookiesRegristry.set('foo', 'bar');
};

module.exports = utils.merge(
    require('./config-common'),
    {
        config: {
            events: {
                request: {
                    helloWorld: {
                        path: '',
                        methods: ['get'],
                        sequences: [
                            {
                                name: 'testCookie'
                            }
                        ],
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
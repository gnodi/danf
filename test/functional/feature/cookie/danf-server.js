'use strict';

function CookieTester() {
};

CookieTester.prototype.test = function() {
    this._cookiesRegristry.set('foo', 'bar');
};

module.exports = {
    config: {
        events: {
            request: {
                helloWorld: {
                    path: '',
                    methods: ['get'],
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/index.jade'
                            }
                        }
                    }
                },
                cookie: {
                    path: '/cookie',
                    methods: ['get'],
                    sequences: ['testCookie'],
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/cookie.jade'
                            }
                        }
                    }
                }
            }
        },
        services: {
            cookieTester: {
                class: CookieTester,
                properties: {
                    _cookiesRegristry: '#danf:http.cookiesRegistry#'
                }
            }
        },
        sequences: {
            testCookie: [
                {
                    service: 'cookieTester',
                    method: 'test'
                }
            ]
        }
    }
};
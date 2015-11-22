'use strict';

function CookieTester() {
};

CookieTester.prototype.test = function() {
    this._cookiesRegristry.set('foo', 'bar');
};

module.exports = {
    config: {
        classes: {
            cookieTester: require('./cookie-tester')
        },
        services: {
            cookieTester: {
                class: 'cookieTester',
                properties: {
                    _cookiesRegristry: '#danf:http.cookiesRegistry#'
                }
            }
        },
        sequences: {
            testCookie: {
                operations: [
                    {
                        service: 'cookieTester',
                        method: 'process'
                    }
                ]
            }
        },
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
};
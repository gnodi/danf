'use strict';

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
};
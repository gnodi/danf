'use strict';

module.exports = {
    config: {
        classes: {
            cookieTester: require('./cookie-tester')
        },
        services: {
            cookieTester: {
                class: 'cookieTester',
                parent: 'danf:ajaxApp.readyProcessor',
                properties: {
                    _cookiesRegristry: '#danf:http.cookiesRegistry#'
                }
            }
        }
    }
};
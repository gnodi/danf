'use strict';

define(function(require) {
    return {
        config: {
            parameters: {
                classes: {
                    cookieTester: require('cookie-tester')
                }
            },
            classes: '%classes%',
            services: {
                cookieTester: {
                    class: '%classes.cookieTester%',
                    parent: 'danf:ajaxApp.readyProcessor',
                    properties: {
                        _cookiesRegristry: '#danf:http.cookiesRegistry#'
                    }
                }
            }
        }
    };
});
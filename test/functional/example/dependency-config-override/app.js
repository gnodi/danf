'use strict';

var danf = require('../../../..');

danf({
    // Define a dependency "form" referencing its danf configuration file.
    dependencies: {
        form: require('form/danf')
    },
    config: {
        // Override the default config of dependency "form".
        // This will result in:
        // form.login.labels = {login: 'Username', password: 'Password'}
        form: {
            form: {
                login: {
                    labels: {
                        login: 'Username'
                    }
                }
            }
        },
        sequences: {
            // Override the sequence "getLoginLabels" of dependency "form".
            // You can do the same for any classes, services, interfaces, ...
            'form:getLoginLabels': [
                {
                    // Danf's service allowing to execute a callback.
                    // Just use it for tests.
                    service: 'danf:manipulation.callbackExecutor',
                    method: 'execute',
                    arguments: [
                        function(labels) {
                            return labels;
                        },
                        // Inject the config field "form.login.labels" of
                        // dependency "form".
                        '$form:form.login.labels$'
                    ],
                    returns: 'form.labels'
                }
            ]
        },
        events: {
            request: {
                index: {
                    path: '/',
                    methods: ['get'],
                    view: {
                        html: {
                            body: {
                                file: __dirname + '/index.jade'
                            }
                        }
                    },
                    // Use the sequence "getLoginLabels" of dependency "form".
                    sequences: ['form:getLoginLabels']
                }
            }
        }
    }
});
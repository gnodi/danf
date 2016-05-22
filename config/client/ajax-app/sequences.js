'use strict';

module.exports = {
    followLink: {
        operations: [
            {
                order: 0,
                service: 'danf:ajaxApp.linkFollower',
                method: 'follow',
                arguments: ['!event!'],
                scope: 'response'
            },
            {
                order: 1,
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(response) {
                        var url = response.headers['X-Danf-Path'];

                        return url ? url : response.url;
                    },
                    '@response@'
                ],
                scope: 'url'
            },
            {
                condition: function(stream) {
                    return stream.response && stream.response.status < 400;
                },
                order: 10,
                service: 'danf:ajaxApp.linkFollower',
                method: 'write',
                arguments: ['@response.text@', '@url@', '!event!']
            }
        ]
    },
    submitForm: {
        operations: [
            {
                order: 0,
                service: 'danf:ajaxApp.formSubmitter',
                method: 'submit',
                arguments: ['!event!'],
                scope: 'response'
            },
            {
                order: 1,
                service: 'danf:manipulation.callbackExecutor',
                method: 'execute',
                arguments: [
                    function(response) {
                        var url = response.headers['X-Danf-Path'];

                        return url ? url : response.url;
                    },
                    '@response@'
                ],
                scope: 'url'
            },
            {
                condition: function(stream) {
                    return stream.response && stream.response.status < 400;
                },
                order: 10,
                service: 'danf:ajaxApp.formSubmitter',
                method: 'write',
                arguments: ['@response.text@', '@url@', '!event!']
            }
        ]
    }
};
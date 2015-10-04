'use strict';

module.exports = {
    process: {
        stream: {
            scope: {
                type: 'object',
                default: null
            }
        },
        operations: [
            {
                order: 0,
                service: 'danf:vendor.jquery',
                method: '.',
                arguments: ['a[data-ajax*="autoload"]', '@scope@'],
                scope: 'links'
            },
            {
                order: 1,
                service: 'danf:vendor.jquery',
                method: 'do',
                arguments: ['@links@', 'click'],
            }
        ],
        parents: [
            {
                target: 'danf:manipulation.process',
                input: {
                    scope: '@scope@'
                }
            }
        ]
    },
    followLink: {
        operations: [
            {
                order: 0,
                service: 'danf:ajaxApp.linkFollower',
                method: 'follow',
                arguments: ['!event.currentTarget!'],
                scope: 'response'
            },
            {
                order: 10,
                service: 'danf:ajaxApp.linkFollower',
                method: 'write',
                arguments: ['@response.content@', '!event.currentTarget!', '!event!']
            },
            {
                order: 20,
                service: 'danf:manipulation.history',
                method: 'replace'
            }
        ]
    },
    submitForm: {
        operations: [
            {
                order: 0,
                service: 'danf:ajaxApp.formSubmitter',
                method: 'submit',
                arguments: ['!event.currentTarget!']
            },
            {
                order: 10,
                service: 'danf:ajaxApp.formSubmitter',
                method: 'write',
                arguments: ['@response.content@', '!event.currentTarget!']
            },
            {
                order: 20,
                service: 'danf:manipulation.history',
                method: 'replace'
            }
        ]
    }
};
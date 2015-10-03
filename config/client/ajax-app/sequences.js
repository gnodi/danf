'use strict';

module.exports = {
    process: {
        data: {
            scope: {
                type: 'object',
                default: null
            }
        },
        operations: [
            {
                condition: function(stream) {
                    return stream.scope ? true : false;
                },
                service: 'danf:event.notifier.dom',
                method: 'refreshListeners',
                arguments: ['@scope@']
            },
            {
                condition: function(stream) {
                    return stream.scope ? false : true;
                },
                service: 'danf:ajaxApp.historyHandler',
                method: 'initialize',
                arguments: ['@scope@']
            }
        ]
    },
    followLink: {
        operations: [
            {
                order: 0;
                service: 'danf:ajaxApp.linkFollower',
                method: 'follow',
                arguments: ['!event.currentTarget!'],
                scope: 'response'
            },
            {
                order: 10;
                service: 'danf:ajaxApp.linkFollower',
                method: 'write',
                arguments: ['@response.content@', '!event.currentTarget!', '!event!']
            },
            {
                order: 20;
                service: 'danf:manipulation.history',
                method: 'replace'
            }
        ]
    },
    submitForm: {
        operations: [
            {
                order: 0;
                service: 'danf:ajaxApp.formSubmitter',
                method: 'submit',
                arguments: ['!event.currentTarget!']
            },
            {
                order: 10;
                service: 'danf:ajaxApp.formSubmitter',
                method: 'write',
                arguments: ['@response.content@', '!event.currentTarget!']
            },
            {
                order: 20;
                service: 'danf:manipulation.history',
                method: 'replace'
            }
        ]
    },
    navigate: {
        operations: [
            {
                service: 'danf:ajaxApp.historyHandler',
                method: 'navigate',
                arguments: ['!event.originalEvent.state!']
            }
        ]
    },
};
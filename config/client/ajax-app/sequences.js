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
                service: 'danf:ajaxApp.historyHandler',
                method: 'initialize',
                arguments: ['@scope@']
            }
        ]
    },
    processAjax: {
        operations: [
            {
                service: 'danf:event.notifier.dom',
                method: 'refreshListeners',
                arguments: ['@data@']
            }
        ]
    },
    followLink: {
        operations: [
            {
                service: 'danf:ajaxApp.linkFollower',
                method: 'follow',
                arguments: ['!event.currentTarget!'],
                scope: 'content'
            },
            {
                service: 'danf:ajaxApp.linkFollower',
                method: 'write',
                arguments: ['@content@']
            },
            {
                service: 'danf:manipulation.history',
                method: 'replace'
            }
        ]
    },
    submitForm: {
        operations: [
            {
                service: 'danf:ajaxApp.formSubmitter',
                method: 'submit',
                arguments: ['!event.currentTarget!']
            },
            {
                service: 'danf:ajaxApp.formSubmitter',
                method: 'write',
                arguments: ['@content@', '!event.currentTarget!']
            },
            {
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
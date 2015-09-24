'use strict';

module.exports = {
    process: [
        {
            service: 'danf:ajaxApp.historyHandler',
            method: 'initialize',
            arguments: []
        }
    ],
    processAjax: [
        {
            service: 'danf:event.notifier.dom',
            method: 'refreshListeners',
            arguments: ['@data@']
        }
    ],
    followLink: [
        {
            service: 'danf:ajaxApp.linkFollower',
            method: 'follow',
            arguments: ['!event.currentTarget!']
        },
        {
            service: 'danf:manipulation.history',
            method: 'replace'
        }
    ],
    submitForm: [
        {
            service: 'danf:ajaxApp.formSubmitter',
            method: 'submit',
            arguments: ['!event.currentTarget!']
        },
        {
            condition: function(stream, context) {

            },
            service: 'danf:manipulation.history',
            method: 'replace'
        }
    ],
    navigate: [
        {
            service: 'danf:ajaxApp.historyHandler',
            method: 'navigate',
            arguments: ['!event.originalEvent.state!']
        }
    ]
};
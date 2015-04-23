'use strict';

module.exports = {
    process: [
        {
            service: 'danf:ajaxApp.historyHandler',
            method: 'initialize',
            arguments: []
        },
        {
            service: 'danf:ajaxApp.processor',
            method: 'process',
            arguments: ['@event@', '@data@']
        }
    ],
    processAjax: [
        {
            service: 'danf:event.notifier.dom',
            method: 'refreshListeners',
            arguments: ['@data@']
        },
        {
            service: 'danf:ajaxApp.processor',
            method: 'process',
            arguments: ['@event@', '@data@']
        }
    ],
    followAjaxLink: [
        {
            service: 'danf:ajaxApp.linksHandler',
            method: 'follow',
            arguments: ['@event.currentTarget@']
        }
    ],
    submitForm: [
        {
            service: 'danf:ajaxApp.formsHandler',
            method: 'submit',
            arguments: ['@event.currentTarget@']
        }
    ],
    navigate: [
        {
            service: 'danf:ajaxApp.historyHandler',
            method: 'navigate',
            arguments: ['@event.originalEvent.state@']
        }
    ]
};
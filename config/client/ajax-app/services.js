'use strict';

module.exports = {
    processor: {
        class: 'danf:ajaxApp.processor',
        properties: {
            ajaxProcessors: '&danf:ajaxApp.readyProcessor&'
        }
    },
    bodyProvider: {
        class: 'danf:ajaxApp.bodyProvider',
        properties: {
            jquery: '#danf:vendor.jquery#'
        }
    },
    readyTrigger: {
        class: 'danf:ajaxApp.readyTrigger',
        properties: {
            readyEvent: '#danf:event.eventsContainer[dom][danf:ajaxApp.ready]#'
        }
    },
    historyHandler: {
        class: 'danf:ajaxApp.historyHandler',
        properties: {
            bodyProvider: '#danf:ajaxApp.bodyProvider#',
            readyTrigger: '#danf:ajaxApp.readyTrigger#'
        }
    },
    linksHandler: {
        class: 'danf:ajaxApp.linksHandler',
        properties: {
            jquery: '#danf:vendor.jquery#',
            bodyProvider: '#danf:ajaxApp.bodyProvider#',
            readyTrigger: '#danf:ajaxApp.readyTrigger#',
            historyHandler: '#danf:ajaxApp.historyHandler#',
            logger: '#danf:logging.logger#'
        }
    },
    formsHandler: {
        class: 'danf:ajaxApp.formsHandler',
        properties: {
            jquery: '#danf:vendor.jquery#',
            bodyProvider: '#danf:ajaxApp.bodyProvider#',
            readyTrigger: '#danf:ajaxApp.readyTrigger#',
            historyHandler: '#danf:ajaxApp.historyHandler#',
            eventTrigger: '#danf:event.eventsHandler#',
            logger: '#danf:logging.logger#'
        }
    },
    readyProcessor: {
        tags: ['danf:ajaxApp.readyProcessor'],
        children: {
            links: {
                class: 'danf:ajaxApp.readyProcessor.links',
                properties: {
                    linksHandler: '#danf:ajaxApp.linksHandler#'
                }
            }
        }
    }
};
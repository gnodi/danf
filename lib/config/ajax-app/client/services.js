'use strict';

define(function(require) {
    return {
        processor: {
            class: '%danf:ajaxApp.classes.processor%',
            properties: {
                ajaxProcessors: '&danf:ajaxApp.readyProcessor&'
            }
        },
        bodyProvider: {
            class: '%danf:ajaxApp.classes.bodyProvider%',
            properties: {
                jquery: '#danf:vendor.jquery#'
            }
        },
        readyTrigger: {
            class: '%danf:ajaxApp.classes.readyTrigger%',
            properties: {
                eventTrigger: '#danf:event.eventsHandler#'
            }
        },
        historyHandler: {
            class: '%danf:ajaxApp.classes.historyHandler%',
            properties: {
                bodyProvider: '#danf:ajaxApp.bodyProvider#',
                readyTrigger: '#danf:ajaxApp.readyTrigger#'
            }
        },
        linksHandler: {
            class: '%danf:ajaxApp.classes.linksHandler%',
            properties: {
                jquery: '#danf:vendor.jquery#',
                bodyProvider: '#danf:ajaxApp.bodyProvider#',
                readyTrigger: '#danf:ajaxApp.readyTrigger#',
                historyHandler: '#danf:ajaxApp.historyHandler#'
            }
        },
        formsHandler: {
            class: '%danf:ajaxApp.classes.formsHandler%',
            properties: {
                jquery: '#danf:vendor.jquery#',
                bodyProvider: '#danf:ajaxApp.bodyProvider#',
                readyTrigger: '#danf:ajaxApp.readyTrigger#',
                historyHandler: '#danf:ajaxApp.historyHandler#',
                eventTrigger: '#danf:event.eventsHandler#'
            }
        },
        readyProcessor: {
            tags: ['danf:ajaxApp.readyProcessor'],
            properties: {
                jquery: '#danf:vendor.jquery#',
                eventTrigger: '#danf:event.eventsHandler#'
            },
            children: {
                links: {
                    class: '%danf:ajaxApp.classes.readyProcessor.links%',
                    properties: {
                        linksHandler: '#danf:ajaxApp.linksHandler#'
                    }
                }
            }
        }
    };
});
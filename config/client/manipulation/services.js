'use strict';

module.exports = {
    bodyProvider: {
        class: 'danf:manipulation.bodyProvider',
        properties: {
            jquery: '#danf:vendor.jquery#'
        }
    },
    readyProcessor: {
        class: 'danf:manipulation.readyProcessor',
        properties: {
            jquery: '#danf:vendor.jquery#',
            processingEvent: '#danf:event.eventsContainer[dom][danf:manipulation.danf]#'
        }
    },
    history: {
        class: 'danf:manipulation.history',
        properties: {
            jquery: '#danf:vendor.jquery#',
            bodyProvider: '#danf:manipulation.bodyProvider#',
            readyProcessor: '#danf:manipulation.readyProcessor#'
        }
    }
};
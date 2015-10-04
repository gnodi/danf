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
            processingSequence: '#danf:event.sequencesContainer[danf:manipulation.process]#'
        }
    },
    history: {
        class: 'danf:manipulation.history',
        properties: {
            bodyProvider: '#danf:manipulation.bodyProvider#',
            readyTrigger: '#danf:manipulation.readyProcessor#'
        }
    }
};
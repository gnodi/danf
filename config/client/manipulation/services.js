'use strict';

module.exports = {
    bodyProvider: {
        class: 'danf:manipulation.bodyProvider',
        properties: {
            jquery: '#danf:vendor.jquery#'
        }
    },
    historyHandler: {
        class: 'danf:manipulation.historyHandler',
        properties: {
            bodyProvider: '#danf:manipulation.bodyProvider#',
            readyTrigger: '#danf:ajaxApp.readyTrigger#'
        }
    }
};
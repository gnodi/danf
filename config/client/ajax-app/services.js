'use strict';

module.exports = {
    linkFollower: {
        class: 'danf:ajaxApp.linkFollower',
        properties: {
            jquery: '#danf:vendor.jquery#',
            bodyProvider: '#danf:manipulation.bodyProvider#',
            history: '#danf:manipulation.history#',
            readyProcessor: '#danf:manipulation.readyProcessor#',
            router: '#danf:http.router#',
            reloadingSequence: '#danf:sequencing.sequencesContainer[danf:ajaxApp.followLink]#'
        }
    },
    formSubmitter: {
        class: 'danf:ajaxApp.formSubmitter',
        properties: {
            jquery: '#danf:vendor.jquery#',
            bodyProvider: '#danf:manipulation.bodyProvider#',
            history: '#danf:manipulation.history#',
            readyProcessor: '#danf:manipulation.readyProcessor#',
            router: '#danf:http.router#'
        }
    }
};
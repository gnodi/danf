'use strict';

module.exports = {
    linkFollower: {
        class: 'danf:ajaxApp.linkFollower',
        properties: {
            jquery: '#danf:vendor.jquery#',
            bodyProvider: '#danf:ajaxApp.bodyProvider#',
            readyTrigger: '#danf:ajaxApp.readyTrigger#',
            router: '#danf:logging.logger#',
            reloadingSequence: '#danf:event.sequencesContainer[danf:ajaxApp.followLink]#'
        }
    },
    formSubmitter: {
        class: 'danf:ajaxApp.formSubmitter',
        properties: {
            jquery: '#danf:vendor.jquery#',
            readyTrigger: '#danf:ajaxApp.readyTrigger#',
            router: '#danf:logging.logger#'
        }
    }
};
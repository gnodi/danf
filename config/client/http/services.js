'use strict';

module.exports = {
    cookiesRegistry: {
        class: 'danf:http.cookiesRegistry'
    },
    event: {
        children: {
            notifier: {
                parent: 'danf:event.notifier',
                children: {
                    request: {
                        class: 'danf:http.event.notifier.request',
                        properties: {
                            jquery: '#danf:vendor.jquery#',
                            history: '#danf:manipulation.history#',
                            logger: '#danf:logging.logger#'
                        }
                    }
                }
            }
        }
    }
};
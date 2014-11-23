'use strict';

module.exports = {
    requestProvider: {
        parent: 'danf:dependencyInjection.contextProvider',
        properties: {
            interface: 'danf:http.request'
        }
    },
    responseProvider: {
        parent: 'danf:dependencyInjection.contextProvider',
        properties: {
            interface: 'danf:http.response'
        }
    },
    errorHandler: {
        class: '%danf:http.classes.errorHandler%',
        properties: {
            debug: '%danf:context.debug%'
        }
    },
    notifier: {
        parent: 'danf:event.notifier',
        children: {
            request: {
                class: '%danf:http.classes.notifier.request%',
                properties: {
                    app: '#danf:app#',
                    renderer: '#danf:rendering.renderer#',
                    errorHandler: '#danf:http.errorHandler#',
                    requestProvider: '#danf:http.requestProvider#',
                    responseProvider: '#danf:http.responseProvider#'
                }
            }
        }
    }
};
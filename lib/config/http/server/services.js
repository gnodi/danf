'use strict';

module.exports = {
    requestProvider: {
        parent: 'danf:dependencyInjection.contextProvider',
        properties: {
            interface: 'object'
        }
    },
    responseProvider: {
        parent: 'danf:dependencyInjection.contextProvider',
        properties: {
            interface: 'object'
        }
    },
    errorHandler: {
        class: '%danf:http.classes.errorHandler%',
        properties: {
            debug: '%danf:context.debug%'
        }
    },
    cookiesRegistry: {
        class: '%danf:http.classes.cookiesRegistry%',
        properties: {
            requestProvider: '#danf:http.requestProvider#',
            responseProvider: '#danf:http.responseProvider#'
        }
    },
    sessionHandler: {
        class: '%danf:http.classes.sessionHandler%',
        properties: {
            requestProvider: '#danf:http.requestProvider#',
            sequencerProvider: '#danf:event.currentSequencerProvider#'
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
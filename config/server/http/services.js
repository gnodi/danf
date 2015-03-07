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
        class: 'danf:http.errorHandler',
        properties: {
            debug: '%danf:context.debug%'
        }
    },
    cookiesRegistry: {
        class: 'danf:http.cookiesRegistry',
        properties: {
            requestProvider: '#danf:http.requestProvider#',
            responseProvider: '#danf:http.responseProvider#'
        }
    },
    sessionHandler: {
        class: 'danf:http.sessionHandler',
        properties: {
            requestProvider: '#danf:http.requestProvider#',
            sequencerProvider: '#danf:event.currentSequencerProvider#'
        }
    },
    event: {
        children: {
            notifier: {
                parent: 'danf:event.notifier',
                children: {
                    request: {
                        class: 'danf:http.event.notifier.request',
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
        }
    }
};
'use strict';

module.exports = {
    messenger: {
        class: 'danf:tcp.messenger',
        properties: {
            app: '#danf:app#',
            event: '#danf:event.eventsContainer[socket][danf:tcp.forwarder]#',
            sessionHandler: '#danf:http.sessionHandler#'
        }
    },
    event: {
        children: {
            notifier: {
                parent: 'danf:event.notifier',
                children: {
                    request: {
                        class: 'danf:tcp.event.notifier.socket',
                        properties: {
                            app: '#danf:app#',
                            debug: '%danf:context.debug%',
                            socketIo: '#danf:vendor.socketIo#',
                            logger: '#danf:logging.logger#'
                        }
                    }
                }
            }
        }
    }
};
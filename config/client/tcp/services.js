'use strict';

module.exports = {
    messenger: {
        class: 'danf:tcp.messenger',
        properties: {
            event: '#danf:event.eventsContainer[socket][danf:tcp.forwarder]#'
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
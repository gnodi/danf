'use strict';

module.exports = {
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
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
                            app: '#danf:app#',
                            debug: '%danf:context.debug%',
                            socketIo: '#danf:vendor.socketIo#',
                            escaper: '#danf:manipulation.escaper#',
                            logger: '#danf:logging.logger#'
                        }
                    }
                }
            }
        }
    }
};
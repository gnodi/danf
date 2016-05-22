'use strict';

module.exports = {
    messenger: require('../../../lib/client/tcp/messenger'),
    event: {
        notifier: {
            socket: require('../../../lib/client/tcp/event/notifier/socket')
        }
    }
};
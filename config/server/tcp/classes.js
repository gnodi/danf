'use strict';

module.exports = {
    messenger: require('../../../lib/server/tcp/messenger'),
    event: {
        notifier: {
            socket: require('../../../lib/server/tcp/event/notifier/socket')
        }
    }
};
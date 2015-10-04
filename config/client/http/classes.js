'use strict';

module.exports = {
    cookiesRegistry: require('../../../lib/client/http/cookies-registry'),
    event: {
        notifier: {
            request: require('../../../lib/client/http/event/notifier/request')
        }
    }
};
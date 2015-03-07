'use strict';

module.exports = {
    errorHandler: require('../../../lib/server/http/error-handler'),
    abstractCookiesRegistry: require('../../../lib/common/http/abstract-cookies-registry'),
    cookiesRegistry: require('../../../lib/server/http/cookies-registry'),
    sessionHandler: require('../../../lib/server/http/session-handler'),
    event: {
        notifier: {
            request: require('../../../lib/server/http/event/notifier/request')
        }
    }
};
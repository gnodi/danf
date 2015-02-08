'use strict';

module.exports = {
    errorHandler: require('../../../http/error-handler'),
    cookiesRegistry: require('../../../http/cookie/server-registry'),
    sessionHandler: require('../../../http/session-handler'),
    notifier: {
        request: require('../../../http/notifier/request')
    }
};
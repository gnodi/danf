'use strict';

module.exports = {
    classes: {
        errorHandler: require('../../../http/error-handler'),
        sessionHandler: require('../../../http/session-handler'),
        notifier: {
            request: require('../../../http/notifier/request')
        }
    }
};
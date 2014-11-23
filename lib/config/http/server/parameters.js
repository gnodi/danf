'use strict';

module.exports = {
    classes: {
        errorHandler: require('../../../http/error-handler'),
        notifier: {
            request: require('../../../http/notifier/request')
        }
    }
};
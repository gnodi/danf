'use strict';

module.exports = {
    logger: {
        class: 'danf:logging.logger',
        properties: {
            verbosity: '%danf:context.verbosity%',
            styles: {
                error: 'red',
                warning: 'yellow'
            },
            chalk: '#danf:vendor.chalk#'
        }
    }
};
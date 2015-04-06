'use strict';

module.exports = {
    classes: {
        logger: require('./logger')
    },
    // Log on the DOM ready event.
    events: {
        dom: {
            ready: {
                event: 'ready',
                sequences: ['logDanf']
            }
        }
    }
};
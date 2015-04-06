'use strict';

module.exports = {
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
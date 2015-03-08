'use strict';

define(function(require) {
    return {
        classes: {
            // You must use "my-app/logger" on the client side.
            // "my-app" is the name you defined in the assets of your server config.
            logger: require('-/my-app/logger')
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
    }
});
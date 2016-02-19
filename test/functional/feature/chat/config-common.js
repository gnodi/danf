'use strict';

module.exports = {
    config: {
        events: {
            request: {
                home: {
                    path: '',
                    methods: ['get']
                }
            },
            socket: {
                messageCreation: {
                },
                messageCreationNotification: {
                }
            }
        }
    }
};
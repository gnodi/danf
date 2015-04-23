'use strict';

module.exports = {
    classes: {
        logger: require('./logger')
    },
    interfaces: {
        logger: {
            methods: {
                log: {
                    arguments: ['string/message']
                }
            }
        }
    },
    services: {
        logger: {
            class: 'logger'
        }
    },
    sequences: {
        logDanf: [
            {
                service: 'logger',
                method: 'log',
                arguments: ['Powered by Danf']
            }
        ]
    }
};
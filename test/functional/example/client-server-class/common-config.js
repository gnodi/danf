'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    return {
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
    }
});
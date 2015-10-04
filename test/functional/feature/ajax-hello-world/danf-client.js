'use strict';

module.exports = {
    config: {
        events: {
            request: {
                hello: {
                    path: '/hello',
                    methods: ['get']
                },
                world: {
                    path: '/world',
                    methods: ['get']
                }
            }
        }
    }
};
'use strict';

module.exports = {
    config: {
        events: {
            request: {
                home: {
                    path: '',
                    methods: ['get']
                },
                form: {
                    path: '/form',
                    methods: ['get'],
                    parameters: {
                        name: {
                            type: 'string',
                            default: ''
                        }
                    }
                },
                a: {
                    path: '/a/:number',
                    methods: ['get']
                },
                b: {
                    path: '/b/:number',
                    methods: ['get']
                },
                c: {
                    path: '/c/:number',
                    methods: ['get']
                }
            }
        }
    }
};
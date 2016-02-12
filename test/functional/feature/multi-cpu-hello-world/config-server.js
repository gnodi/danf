'use strict';

module.exports = {
    config: {
        events: {
            request: {
                helloWorld: {
                    path: '',
                    methods: ['get'],
                    view: {
                        text: {
                            value: 'Hello world!'
                        }
                    }
                }
            }
        }
    }
};
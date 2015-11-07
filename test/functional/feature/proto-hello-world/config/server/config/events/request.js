'use strict';

module.exports = {
    helloWorld: {
        path: '',
        methods: ['get'],
        view: {
            html: {
                body: {
                    file: '%rootPath%/index.jade'
                },
                layout: {
                    file: '%rootPath%/layout.jade'
                }
            }
        }
    }
};
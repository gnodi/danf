'use strict';

module.exports = {
    home: {
        path: '/',
        methods: ['get'],
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/index.jade'
                }
            }
        }
    }
};
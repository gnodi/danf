'use strict';

/**
 * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/documentation/event.md
 */
module.exports = {
    home: {
        path: '/',
        methods: ['get'],
        sequences: [
            {
                name: 'compute'
            }
        ],
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
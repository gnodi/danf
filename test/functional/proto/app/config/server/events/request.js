'use strict';

module.exports = {
    /* // Use (https://github.com/gnodi/danf/blob/master/resource/private/doc/use/events.md):
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
    },
    apiGetSomething: {
        path: '/api/something/{id}',
        methods: ['get'],
        parameters: {
            id: {
                type: 'number',
                required: true
            }
        },
        sequences: ['getSomething'],
        view: {
            json: {
                select: ['frameworkScores']
            }
        }
    }
    */
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
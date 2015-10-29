'use strict';

module.exports = {
    /**
     * @see https://github.com/gnodi/danf/blob/master/resource/private/doc/use/events.md
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
    },
    message: {
        path: '/message',
        parameters: {
            color: {
                type: 'string',
                required: true
            }
        },
        children: {
            get: {
                methods: ['get'],
                sequences: [
                    {
                        name: 'getCurrentColor',
                        output: {
                            color: '@color@'
                        }
                    },
                    {
                        name: 'getLastMessage',
                        output: {
                            message: '@message@'
                        }
                    }
                ]
            }
            post: {
                methods: ['post'],
                sequences: [
                    {
                        name: 'displayMessage',
                        output: {
                            color: '@color@'
                        }
                    }
                ]
            }
        }
    }
};
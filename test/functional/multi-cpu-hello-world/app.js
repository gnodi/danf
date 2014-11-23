'use strict';

var danf = require('../../../index'),
    app = danf(
        {
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
        },
        {
            workers: -1
        }
    )
;
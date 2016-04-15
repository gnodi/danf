'use strict';

module.exports = {
    // Define a request.
    home: {
        // Define the path of the request.
        path: '/',
        // Define the available HTTP methods.
        methods: ['get'],
        // Link the sequences.
        sequences: [
            {
                name: 'compute',
                output: {
                    result: {
                        simple: '@simple@',
                        unpredictable: '@unpredictable@',
                        parallel: '@parallel@',
                        series: '@series@',
                        collection: '@collection@'
                    }
                }
            }
        ],
        // Define the view.
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
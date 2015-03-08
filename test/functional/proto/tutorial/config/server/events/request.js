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
    },
    framework: {
        path: '/framework',
        methods: ['get'],
        sequences: ['buildQuestionsForm'],
        view: {
            html: {
                layout: {
                    file: '%view.path%/layout.jade'
                },
                body: {
                    file: '%view.path%/framework.jade'
                }
            }
        }
    },
    apiGetFrameworksScores: {
        path: '/api/frameworks/scores',
        methods: ['get'],
        parameters: {
            answers: {
                type: 'boolean_object',
                default: {}
            }
        },
        sequences: ['computeFrameworkScores'],
        view: {
            json: {
                select: ['frameworkScores']
            }
        }
    }
};
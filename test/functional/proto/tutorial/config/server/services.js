'use strict';

module.exports = {
    frameworkSelector: {
        class: 'frameworkSelector',
        properties: {
            frameworks: '$frameworks$',
            categoryComputers: '&categoryComputer&'
        }
    },
    questionsRetriever: {
        class: 'questionsRetriever',
        properties: {
            questions: '$questions$'
        }
    },
    categoryComputer: {
        tags: ['categoryComputer'],
        properties: {
            scoresDirectory: '$questions.directory$',
            sequencerProvider: '#danf:event.currentSequencerProvider#',
            benchmarker: '#benchmarker#'
        },
        children: {
            dumb: {
                class: 'categoryComputer.dumb',
                abstract: true,
                declinations: '$questions.dumb$',
                properties: {
                    boost: '@boost@',
                    questions: '@questions@'
                }
            },
            useless: {
                class: 'categoryComputer.useless',
                abstract: true,
                declinations: '$questions.useless$',
                properties: {
                    boost: '@boost@',
                    questions: '@questions@'
                }
            }
        }
    }
};
'use strict';

module.exports = {
    frameworkSelector: {
        class: '%classes.frameworkSelector%',
        properties: {
            frameworks: '$frameworks$',
            categoryComputers: '&categoryComputer&'
        }
    },
    questionsRetriever: {
        class: '%classes.questionsRetriever%',
        properties: {
            questions: '$questions$'
        }
    },
    categoryComputer: {
        tags: ['categoryComputer'],
        properties: {
            scoresDirectory: '$questions.directory$',
            sequencerProvider: '#danf:event.sequencerProvider#',
            benchmarker: '#benchmarker#'
        },
        children: {
            dumb: {
                class: '%classes.categoryComputer.dumb%',
                abstract: true,
                declinations: '$questions.dumb$',
                properties: {
                    boost: '@boost@',
                    questions: '@questions@'
                }
            },
            useless: {
                class: '%classes.categoryComputer.useless%',
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
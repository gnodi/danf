'use strict';

module.exports = {
    computeFrameworkScores: [
        {
            service: 'frameworkSelector',
            method: 'computeScores',
            arguments: ['@answers@'],
            returns: 'frameworkScores'
        },
        {
            service: 'frameworkSelector',
            method: 'weightScores',
            arguments: ['@frameworkScores@'],
            returns: 'frameworkScores'
        }
    ],
    buildQuestionsForm: [
        {
            service: 'questionsRetriever',
            method: 'retrieve',
            returns: 'questions'
        }
    ]
};
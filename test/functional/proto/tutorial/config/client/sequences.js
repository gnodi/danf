'use strict';

module.exports = {
    startComputingMeasure: [
        {
            service: 'benchmarker',
            method: 'start',
            arguments: ['%computingMeasureId%']
        }
    ],
    displayComputingResult: [
        {
            service: 'listDisplayer',
            method: 'display',
            arguments: ['result', '@data.data.frameworkScores@']
        }
    ]
};
'use strict';

define(function(require) {
    return {
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
    }
});
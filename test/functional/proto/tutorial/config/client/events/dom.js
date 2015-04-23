'use strict';

module.exports = {
    formSubmitting: {
        selector: '#framework-form :submit',
        event: 'click',
        sequences: ['startComputingMeasure']
    }
};
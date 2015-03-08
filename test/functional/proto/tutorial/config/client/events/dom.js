'use strict';

define(function(require) {
    return {
        formSubmitting: {
            selector: '#framework-form :submit',
            event: 'click',
            sequences: ['startComputingMeasure']
        }
    };
});
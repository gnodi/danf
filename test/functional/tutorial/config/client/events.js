'use strict';

define(function(require) {
    return {
        dom: {
            formSubmitting: {
                selector: '#framework-form :submit',
                event: 'click',
                sequences: ['startComputingMeasure']
            }
        },
        event: {
            'danf:form.framework': {
                sequences: ['displayComputingResult']
            }
        }
    }
});
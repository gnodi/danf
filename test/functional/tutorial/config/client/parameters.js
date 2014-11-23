'use strict';

define(function(require) {
    return {
        computingMeasureId: 'Computing',
        classes: {
            listDisplayer: require('tutorial/lib/client/list-displayer'),
            benchmarker: require('tutorial/lib/common/benchmarker')
        }
    }
});
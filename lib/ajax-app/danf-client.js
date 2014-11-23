define(function(require) {
    var utils = require('danf/utils');

    return {
        parameters: {
            'danf:ajaxApp': require('danf/ajax-app/config/client/parameters')
        },
        interfaces: utils.flatten({
            'danf:ajaxApp': require('danf/ajax-app/config/client/interfaces')
        }, 1),
        services: utils.flatten({
            'danf:ajaxApp': require('danf/ajax-app/config/client/services')
        }, 1),
        events: require('danf/ajax-app/config/client/events'),
        sequences: utils.flatten({
            'danf:ajaxApp': require('danf/ajax-app/config/client/sequences')
        }, 1),
        classes: {'danf:ajaxApp': '%danf:ajaxApp.classes%'}
    };
});
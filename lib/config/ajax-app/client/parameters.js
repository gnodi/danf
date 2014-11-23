'use strict';

define(function(require) {
    return {
        classes: {
            processor: require('danf/ajax-app/processor'),
            bodyProvider: require('danf/ajax-app/body-provider'),
            readyTrigger: require('danf/ajax-app/ready-trigger'),
            historyHandler: require('danf/ajax-app/history-handler'),
            linksHandler: require('danf/ajax-app/links-handler'),
            formsHandler: require('danf/ajax-app/forms-handler'),
            readyProcessor: {
                abstract: require('danf/ajax-app/ready-processor/abstract'),
                links: require('danf/ajax-app/ready-processor/links')
            }
        }
    };
});
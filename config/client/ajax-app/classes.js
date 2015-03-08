'use strict';

define(function(require) {
    return {
        processor: require('-/danf/lib/client/ajax-app/processor'),
        bodyProvider: require('-/danf/lib/client/ajax-app/body-provider'),
        readyTrigger: require('-/danf/lib/client/ajax-app/ready-trigger'),
        historyHandler: require('-/danf/lib/client/ajax-app/history-handler'),
        linksHandler: require('-/danf/lib/client/ajax-app/links-handler'),
        formsHandler: require('-/danf/lib/client/ajax-app/forms-handler'),
        readyProcessor: {
            abstract: require('-/danf/lib/client/ajax-app/ready-processor/abstract'),
            links: require('-/danf/lib/client/ajax-app/ready-processor/links')
        }
    };
});
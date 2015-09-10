'use strict';

module.exports = {
    processor: require('../../../lib/client/ajax-app/processor'),
    bodyProvider: require('../../../lib/client/ajax-app/body-provider'),
    readyTrigger: require('../../../lib/client/ajax-app/ready-trigger'),
    historyHandler: require('../../../lib/client/ajax-app/history-handler'),
    linksHandler: require('../../../lib/client/ajax-app/links-handler'),
    formsHandler: require('../../../lib/client/ajax-app/forms-handler'),
    readyProcessor: {
        links: require('../../../lib/client/ajax-app/ready-processor/links')
    }
};
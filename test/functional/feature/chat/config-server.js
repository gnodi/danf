'use strict';

var utils = require('../../../../lib/common/utils');

function Messenger() {}
Messenger.prototype.notify = function(message) {
    if ('' !== message) {
        this.messageEvent.trigger({message: message});
    }
}

module.exports = utils.merge(
    require('./config-common'),
    {
        config: {
            events: {
                request: {
                    home: {
                        view: {
                            html: {
                                layout: {
                                    file: __dirname + '/layout.jade'
                                },
                                body: {
                                    file: __dirname + '/index.jade'
                                }
                            }
                        }
                    }
                },
                socket: {
                    messageCreation: {
                        sequences: [
                            {
                                name: 'notifyMessage',
                                input: {
                                    message: '@message@'
                                }
                            }
                        ]
                    }
                }
            },
            sequences: {
                notifyMessage: {
                    operations: [
                        {
                            service: 'messenger',
                            method: 'notify',
                            arguments: ['@message@']
                        }
                    ]
                }
            },
            services: {
                messenger: {
                    class: Messenger,
                    properties: {
                        messageEvent: '#danf:event.eventsContainer[socket][messageCreationNotification]#'
                    }
                }
            }
        }
    },
    true
);
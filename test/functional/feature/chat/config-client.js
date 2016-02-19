'use strict';

var utils = require('../../../../lib/common/utils');

function Messenger() {}
Messenger.prototype.send = function(submitter) {
    var $ = this.jquery,
        submitter = $(submitter),
        form = submitter.closest('form'),
        data = form.serializeArray(),
        message = ''
    ;

    for (var i = 0; i < data.length; i++) {
        if ('message' === data[i].name) {
            message = data[i].value;
        }
    }

    if ('' !== message) {
        this.messageEvent.trigger({message: message});
    }
}
Messenger.prototype.write = function(data) {
    $('#chat').append('<p>{0}</p>'.format(message));
}

module.exports = utils.merge(
    require('./config-common'),
    {
        config: {
            events: {
                dom: {
                    submitMessage: {
                        event: 'click',
                        selector: '#message :submit',
                        preventDefault: true,
                        stopPropagation: true,
                        sequences: [
                            {
                                name: 'sendMessage'
                            }
                        ]
                    }
                },
                socket: {
                    messageCreationNotification: {
                        data: {
                            message: {
                                type: 'string',
                                required: true
                            }
                        },
                        sequences: [
                            {
                                name: 'receiveMessage',
                                input: {
                                    message: '@message@'
                                }
                            }
                        ]
                    }
                }
            },
            sequences: {
                sendMessage: {
                    operations: [
                        {
                            order: 0,
                            service: 'messenger',
                            method: 'send',
                            arguments: ['!event.target!']
                        }
                    ]
                },
                receiveMessage: {
                    stream: {
                        message: {
                            type: 'string',
                            required: true
                        }
                    },
                    operations: [
                        {
                            order: 0,
                            service: 'messenger',
                            method: 'write',
                            arguments: ['@message@']
                        }
                    ]
                }
            },
            services: {
                messenger: {
                    class: Messenger,
                    properties: {
                        jquery: '#danf:vendor.jquery#',
                        messageEvent: 'danf:event.eventsContainer[socket][messageCreation]'
                    }
                }
            }
        }
    },
    true
);
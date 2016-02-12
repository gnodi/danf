'use strict';

module.exports = {
    config: {
        events: {
            command: {
                welcome: {
                    options: {
                        name: {
                            type: 'string',
                            default: 'World'
                        }
                    },
                    sequences: [
                        {
                            name: 'log',
                            input: {
                                name: '@name@'
                            }
                        }
                    ]
                }
            }
        },
        sequences: {
            log: {
                operations: [
                    {
                        order: 0,
                        service: 'danf:manipulation.callbackExecutor',
                        method: 'execute',
                        arguments: [
                            function(name) {
                                return name.charAt(0).toUpperCase() + name.slice(1)
                            },
                            '@name@'
                        ],
                        scope: 'name'
                    },
                    {
                        order: 1,
                        service: 'danf:logging.logger',
                        method: 'log',
                        arguments: ['Hello @name@!']
                    }
                ]
            }
        }
    }
};
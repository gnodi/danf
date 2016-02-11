'use strict';

module.exports = {
    parser: {
        class: 'danf:command.parser',
        properties: {
            commandProvider: '#danf:command.commandProvider#'
        }
    },
    commandProvider: {
        parent: 'danf:dependencyInjection.objectProvider',
        properties: {
            class: 'danf:command.command',
            interface: 'danf:command.command'
        }
    },
    event: {
        children: {
            notifier: {
                parent: 'danf:event.notifier',
                children: {
                    request: {
                        class: 'danf:command.event.notifier.command',
                        properties: {
                            logger: 'danf:logging.logger'
                        }
                    }
                }
            }
        }
    }
}
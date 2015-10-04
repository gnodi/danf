'use strict';

module.exports = {
    process: {
        stream: {
            scope: {
                type: 'object',
                default: null
            }
        },
        operations: [
            {
                condition: function(stream) {
                    return stream.scope ? true : false;
                },
                service: 'danf:event.notifier.dom',
                method: 'refreshListeners',
                arguments: ['@scope@']
            }
        ],
        parents: [
            {
                order: -20,
                target: 'danf:manipulation.process',
                input: {
                    scope: '@scope@'
                }
            }
        ]
    }
};
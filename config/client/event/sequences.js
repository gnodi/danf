'use strict';

module.exports = {
    process: {
        data: {
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
            name: 'danf:manipulation.process',
            input: {
                scope: '@scope@'
            }
        ]
    }
};
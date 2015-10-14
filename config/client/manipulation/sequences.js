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
                order: -10,
                condition: function(stream) {
                    return stream.scope ? false : true;
                },
                service: 'danf:manipulation.history',
                method: 'initialize',
                arguments: ['@scope@']
            }
        ]
    },
    navigate: {
        operations: [
            {
                order: 0,
                service: 'danf:manipulation.history',
                method: 'navigate',
                arguments: ['!event.originalEvent.state!']
            }
        ]
    }
};
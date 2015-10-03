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
                service: 'danf:manipulation.history',
                method: 'navigate',
                arguments: ['!event.originalEvent.state!']
            }
        ]
    },
};
'use strict';

module.exports = {
    followLink: {
        operations: [
            {
                order: 0,
                service: 'danf:ajaxApp.linkFollower',
                method: 'follow',
                arguments: ['!event!'],
                scope: 'response'
            },
            {
                condition: function(stream) {
                    return stream.response && stream.response.status < 400;
                },
                order: 10,
                service: 'danf:ajaxApp.linkFollower',
                method: 'write',
                arguments: ['@response.text@', '@response.url@', '!event!']
            }
        ]
    },
    submitForm: {
        operations: [
            {
                order: 0,
                service: 'danf:ajaxApp.formSubmitter',
                method: 'submit',
                arguments: ['!event!'],
                scope: 'response'
            },
            {
                condition: function(stream) {
                    return stream.response && stream.response.status < 400;
                },
                order: 10,
                service: 'danf:ajaxApp.formSubmitter',
                method: 'write',
                arguments: ['@response.text@', '@response.url@', '!event!']
            }
        ]
    }
};
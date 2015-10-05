'use strict';

module.exports = {
    followLink: {
        operations: [
            {
                order: 0,
                service: 'danf:ajaxApp.linkFollower',
                method: 'follow',
                arguments: ['!event.target!'],
                scope: 'response'
            },
            {
                order: 10,
                service: 'danf:ajaxApp.linkFollower',
                method: 'write',
                arguments: ['@response.text@', '!event.target!', '!event!']
            },
            {
                order: 20,
                service: 'danf:manipulation.history',
                method: 'replace',
                arguments: []
            }
        ]
    },
    submitForm: {
        operations: [
            {
                order: 0,
                service: 'danf:ajaxApp.formSubmitter',
                method: 'submit',
                arguments: ['!event.target!']
            },
            {
                order: 10,
                service: 'danf:ajaxApp.formSubmitter',
                method: 'write',
                arguments: ['@response.text@', '!event.target!']
            },
            {
                order: 20,
                service: 'danf:manipulation.history',
                method: 'replace',
                arguments: []
            }
        ]
    }
};
'use strict';

module.exports = {
    contract: {
        test: {
            type: 'number',
        }
    },
    config: {
        this: {
            test: 2
        },
        global: {
            value: 2
        },
        'global/prod': {
            value: 4
        },
        'global/test': {
            value: 5
        },
        'global/dev': {
            value: 6
        }
    }
};
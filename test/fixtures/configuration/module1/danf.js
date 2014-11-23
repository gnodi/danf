'use strict';

module.exports = {
    dependencies: {
        module3: require('./module3/danf'),
        module5: {}
    },
    contract: {
        test: {
            type: 'embedded',
            embed: {
                value: {
                    type: 'number'
                },
                text: {
                    type: 'string'
                }
            }
        },
        value: {
            type: 'number'
        }
    },
    config: {
        this: {
            test: {
                value: 1,
                text: 'text'
            },
            value: 1
        }
    }
};
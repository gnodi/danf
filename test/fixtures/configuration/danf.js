'use strict';

module.exports = {
    dependencies: {
        module1: require('./module1/danf'),
        module2: require('./module2/danf'),
        module4: 'module1',
        'module1:module5': 'module1:module3',
        'module4:module5': 'module2'
    },
    contract: {
        test: {
            type: 'number',
        }
    },
    config: {
        this: {
            test: 0
        },
        module1: {
            test: { value: 0 }
        },
    }
};
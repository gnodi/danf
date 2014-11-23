'use strict';

var Counter = function() { this._count = 0; };
Counter.defineImplementedInterfaces(['counter']);
Counter.prototype.inc = function() {
    this._count++;
};
Object.defineProperty(Counter.prototype, 'count', {
    get: function() {
        return this._count;
    },
    set: function(count) {
        this._count = count;
    }
});

module.exports = {
    dependencies: {
        module100: require('./module100-v1-danf')
    },
    contract: {
        timeOut: {
            type: 'number'
        }
    },
    config: {
        parameters: {
            classes: {
                counter: Counter
            }
        },
        classes: {
            counter: '%classes.counter%'
        },
        interfaces: {
            counter: {
                methods: {
                    inc: {}
                },
                getters: {
                    count: 'number'
                },
                setters: {
                    count: 'number'
                }
            },
            manager: {}
        },
        services: {
            counter: {
                class: '%classes.counter%'
            }
        },
        this: {
            timeOut: 1000
        }
    }
};
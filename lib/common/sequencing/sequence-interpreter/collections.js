'use strict';

/**
 * Expose `Collections`.
 */
module.exports = Collections;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new collections sequence interpreter.
 */
function Collections() {
    Abstract.call(this);

    this._order = 600;
    this._collections = {};
}

utils.extend(Abstract, Collections);

/**
 * @interface {danf:sequencing.sequenceInterpreter}
 */
Object.defineProperty(Collections.prototype, 'contract', {
    value: {
        collections: {
            type: 'string_array',
            namespace: true,
            default: []
        }
    }
});

/**
 * @interface {danf:sequencing.sequenceInterpreter}
 */
Collections.prototype.buildContext = function(context, definition) {
    if (undefined === context.collections) {
        context.collections = {};
    }

    if (definition.collections) {
        var collections = definition.collections;

        for (var i = 0; i < collections.length; i++) {
            var collection = collections[i];

            if (undefined === context.collections[collection]) {
                context.collections[collection] = [];
            }

            context.collections[collection].push(definition.id);
        }
    }

    return context;
}

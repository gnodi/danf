'use strict';

/**
 * Expose `Event`.
 */
module.exports = Event;

/**
 * Module dependencies.
 */
var utils = require('../../utils'),
    Abstract = require('./abstract')
;

/**
 * Initialize a new event notifier.
 *
 * @param {danf:manipulation.dataResolver} dataResolver The data resolver.
 */
function Event(dataResolver) {
    Abstract.call(this, dataResolver);
}

utils.extend(Abstract, Event);

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Event.prototype, 'name', {
    value: 'event'
});

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Event.prototype, 'contract', {
    value: {
        context: {
            type: 'mixed_object',
            default: {}
        },
        callback: {
            type: 'function'
        }
    }
});

/**
 * @inheritdoc
 */
Event.prototype.notifyEvent = function(name, parameters, sequence, data) {
    sequence.execute(data, parameters.context, '.', parameters.callback);
}
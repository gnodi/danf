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
 */
function Event() {
    Abstract.call(this);
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
        catch: {
            type: 'function|null'
        },
        callback: {
            type: 'function|null'
        }
    }
});

/**
 * @inheritdoc
 */
Event.prototype.notifyEvent = function(name, parameters, sequence, data, meta) {
    sequence.execute(data, parameters.context, '.', parameters.catch, parameters.callback);
}
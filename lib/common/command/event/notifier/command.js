'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../../common/utils'),
    Abstract = require('../../../event/notifier/abstract')
;

/**
 * Expose `Command`.
 */
module.exports = Command;

/**
 * Initialize a new command notifier.
 */
function Command() {
    Abstract.call(this);
}

utils.extend(Abstract, Command);

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Command.prototype, 'name', {
    value: 'command'
});

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Command.prototype, 'contract', {
    get: function () {
        return {
            options: {
                type: 'object'
            },
            aliases: {
                type: 'string_object',
                default: {},
                validate: function (value) {
                    for (var key in value) {
                        if (key.length >= 2) {
                            throw new Error('a string object with aliases of one character as key and option name as value');
                        }
                    }
                }
            }
        };
    }
});

/**
 * @inheritdoc
 */
Command.prototype.getEventDataContract = function(event) {
    return null;
}

/**
 * @inheritdoc
 */
Command.prototype.notifyEvent = function(name, parameters, sequence, data) {
    var callback = data.callback;

    delete data.callback;

    if (parameters.options) {
        if (undefined === parameters.options._) {
            parameters.options._ = {
                type: 'mixed_array',
                default: []
            };
        }

        data = this._dataResolver.resolve(
            data,
            parameters.options,
            'event[{0}][{1}].data'.format(this.name, event.name)
        );
    }

    sequence.execute(data, {}, '.', callback);
}
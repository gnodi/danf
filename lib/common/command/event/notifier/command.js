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
                type: 'object',
                validate: function(value) {
                    if (undefined === value._) {
                        value._ = {
                            type: 'string_array',
                            default: []
                        }
                    }
                }
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
        data = this._dataResolver.resolve(
            data,
            parameters.options,
            'command[{0}].data'.format(name)
        );
    }

    sequence.execute(data, {}, '.', null, callback);
}
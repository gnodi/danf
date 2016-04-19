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

Command.defineDependency('_logger', 'danf:logging.logger');

/**
 * Logger.
 *
 * @var {danf:logging.logger}
 * @api public
 */
Object.defineProperty(Command.prototype, 'logger', {
    set: function(logger) { this._logger = logger; }
});

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
    var self = this,
        errored = false,
        callback = data.callback,
        handleErrors = function(errors) {
            var error;

            if (1 === errors.length) {
                error = errors[0];
            } else {
                error = new Error('');

                error.embedded = [];
            }

            self._logger.log(
                '<<error>><<bold>>Command "{0}" processing failed.'.format(
                    name
                ),
                1
            );

            var messages = [];

            for (var i = 0; i < errors.length; i++) {
                self._logger.log('<<error>>{0}'.format(errors[i].message), 1);
                self._logger.log('<<grey>>{0}'.format(errors[i].stack), 2, 1);

                messages.push(errors[i].message);

                if (1 !== errors.length) {
                    error.embedded.push(errors[i])
                }
            }

            if (1 !== errors.length) {
                error.message = messages.join('; ');
            }

            errored = true;

            if (callback) {
                callback(error);
            }
        }
    ;

    delete data.callback;

    try {
        if (parameters.options) {
            data = this._dataResolver.resolve(
                data,
                parameters.options,
                'command[{0}].data'.format(name)
            );
        }

        sequence.execute(data, {}, '.', handleErrors, function() {
            if (callback && !errored) {
                callback();
            }
        });
    } catch (error) {
        handleErrors([error]);
    }
}
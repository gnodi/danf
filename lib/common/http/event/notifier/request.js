'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../../common/utils'),
    Abstract = require('../../../event/notifier/abstract')
;

/**
 * Expose `Request`.
 */
module.exports = Request;

/**
 * Initialize a new request notifier.
 */
function Request() {
    Abstract.call(this);
}

utils.extend(Abstract, Request);

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Request.prototype, 'name', {
    value: 'request'
});

/**
 * @interface {danf:event.notifier}
 */
Object.defineProperty(Request.prototype, 'contract', {
    get: function () {
        var specificContract = this.getSpecificContract();
            contract = {
                path: {
                    format: function(value) {
                        return formatPath(value);
                    },
                    type: 'string',
                    required: true
                },
                headers: {
                    type: 'string_object',
                    default: {}
                },
                methods: {
                    format: function(value) {
                        if (Array.isArray(value)) {
                            for (var i = 0; i < value.length; i++) {
                                value[i] = value[i].toUpperCase();
                            }

                            return value;
                        }
                    },
                    type: 'string_array',
                    required: true,
                    validate: function(value) {
                        if (value.length === 0) {
                            throw new Error('an array with at least one HTTP method');
                        }

                        for (var i = 0; i < value.length; i++) {
                            if (!isHttpMethod(value[i])) {
                                throw new Error('an array with valid HTTP methods');
                            }
                        }
                    }
                },
                parameters: {
                    type: 'object'
                },
                data: {
                    type: 'mixed',
                    validate: function(value) {
                        if (value != null) {
                            throw new Error(
                               'The field "data" must not be defined for a request event; use field "parameters" instead.'
                            );
                        }
                    }
                }
            }
        ;

        return utils.merge(contract, specificContract);
    }
});

/**
 * Get the specific contract that a request event kind should respect.
 *
 * @param {danf:event.event} event The event.
 * @return {object} The contract.
 * @api protected
 */
Request.prototype.getSpecificContract = function() {
    return {};
};

/**
 * Get the contract that data should respect for an event.
 *
 * @param {danf:event.event} event The event.
 * @return {object} The contract.
 * @api protected
 */
Request.prototype.getEventDataContract = function(event) {
    var specificContract = this.getEventDataSpecificContract();
        contract = {
            path: {
                format: function(value) {
                    return formatPath(value);
                },
                type: 'string',
                required: true
            },
            method: {
                format: function(value) {
                    if ('string' === typeof value) {
                        return value.toUpperCase();
                    }
                },
                type: 'string',
                required: true,
                validate: function(value) {
                    if (!isHttpMethod(value)) {
                        throw new Error('a valid HTTP method');
                    }

                    var isDefinedMethod = false;

                    for (var i = 0; i < event.parameters.methods.length; i++) {
                        if (event.parameters.methods[i] === method) {
                            isDefinedMethod = true;
                            break;
                        }
                    }

                    if (!isDefinedMethod) {
                        throw new Error('one of ["{0}"]'.format(
                            event.parameters.methods.join('", "');
                        ));
                    }
                }
            },
            host: {
                type: 'string',
            },
            protocol: {
                type: 'string',
                default: 'http'
            },
            parameters: {
                type: 'object|string',
                default: ''
            },
            headers: {
                type: 'object',
                default: {}
            }
        }
    ;

    return utils.merge(contract, specificContract);
};

/**
 * Get the specific contract that data should respect for an event kind.
 *
 * @param {danf:event.event} event The event.
 * @return {object} The contract.
 * @api protected
 */
Request.prototype.getEventDataSpecificContract = function(event) {
    return {};
}

/**
 * Whether or not it is a valid HTTP method.
 *
 * @return {boolean} True if this is a valid HTTP method, false otherwise.
 * @api private
 */
var isHttpMethod = function(method) {
    return method in {
        GET: true,
        HEAD: true,
        POST: true,
        OPTIONS: true,
        CONNECT: true,
        TRACE: true,
        PUT: true,
        PATCH: true,
        DELETE: true
    };
}

/**
 * Format a path.
 *
 * @param {string} path The path.
 * @return {string} The formatted path.
 * @api private
 */
var formatPath = function(path) {
    if ('string' === typeof value) {
        if ('' === path) {
            path = '/';
        } else {
            path = /^http[s]?:\/\//i.test(value)
                ? value
                : ('/' !== value[0] ? '/' + value : value)
            ;
        }
    }

    return path;
}

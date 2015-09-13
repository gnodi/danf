'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../../common/utils'),
    Abstract = require('../../../../common/event/notifier/abstract')
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

Request.defineDependency('_errorHandler', 'danf:http.errorHandler');
Request.defineDependency('_logger', 'danf:logging.logger');

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
        return {
            path: {
                type: 'string',
                required: true
            },
            headers: {
                type: 'string_object',
            },
            methods: {
                type: 'string_array',
                required: true
            },
            parameters: {
                type: 'mixed_object'
            },
            view: this._renderer.contract
        };
    }
});

/**
 * Set the error handler.
 *
 * @param {danf:http.errorHandler}
 * @api public
 */
Object.defineProperty(Request.prototype, 'errorHandler', {
    set: function(errorHandler) { this._errorHandler = errorHandler; }
});

/**
 * Set the logger.
 *
 * @param {danf:logging.logger}
 * @api public
 */
Object.defineProperty(Request.prototype, 'logger', {
    set: function(logger) { this._logger = logger; }
});

/**
 * @inheritdoc
 */
Request.prototype.addEventListener = function(name, parameters, sequence) {
    var self = this,
        path = parameters.path ? parameters.path : '/',
        headers = parameters.headers,
        methods = parameters.methods,
        params = parameters.parameters,
        view = parameters.view
    ;
}

/**
 * @inheritdoc
 */
Request.prototype.notifyEvent = function(name, parameters, sequence, data) {
    var path = parameters.path ? parameters.path : '/',
        methods = parameters.methods || [],
        method = 'GET',
        callback = data.callback,
        query = '',
        body = ''
    ;
}
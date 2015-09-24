'use strict';

/**
 * Module dependencies.
 */
var utils = require('../../../../common/utils'),
    Abstract = require('../../../../common/http/event/notifier/request')
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

Request.defineDependency('_jquery', 'function');
Request.defineDependency('_logger', 'danf:logging.logger');

/**
 * @inheritdoc
 */
Request.prototype.getSpecificContract = function() {
    return {
        settings: {
            format: function(value) {
                if ('object' === typeof value && null != value) {
                    if (null == value.headers) {
                        value.headers = {};
                    }
                }
            },
            type: 'object',
            default: {},
            validate: function(value) {
                if (value.method) {
                    throw new Error(
                        'an object with no property "method" (the HTTP method is given at the event triggering)'
                    );
                }

                if (value.url) {
                    throw new Error(
                        'an object with no property "url" (the url/path is given at the event triggering)'
                    );
                }

                if (value.data) {
                    throw new Error(
                        'an object with no property "data" (the request parameters are given at the event triggering)'
                    );
                }
            }
        },
        process: {
            type: 'object',
            validate: function(value) {
                if (!(value in {done: true, fail: true, always: true})) {
                    throw new Error('one of ["done", "fail", "always"]');
                }
            },
            default: 'done'
        }
    };
}

/**
 * Set JQuery.
 *
 * @param {function}
 * @api public
 */
Object.defineProperty(Request.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
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
Request.prototype.notifyEvent = function(name, parameters, sequence, data) {
    var self = this,
        $ = jquery,
        settings = parameters.settings
    ;

    // Set request data.
    settings.data = data.parameters;

    // Set HTTP method.
    settings.method = data.method;

    // Merge additional headers.
    settings.headers = utils.merge(
        settings.headers,
        parameters.headers
    );

    // Format url.
    var url = data.path;

    if ('localhost' !== data.hostname || data.port) {
        url = '{0}//{1}{2}{3}'.format(
            data.protocol,
            data.hostname,
            data.port ? ':{0}'.format(data.port) : '',
            url
        );

        // Interpret defined hostname as cross domain request.
        if (null == settings.crossDomain) {
            settings.crossDomain = true;
        }
    }

    // Set url.
    settings.url = url;

    var request = utils.merge(
            data,
            {settings: settings}
        )
    ;

    // Process request.
    this.__asyncProcess(function(returnAsync) {
        $.ajax(settings)
            .done(function(data, textStatus, jqXHR) {
                self._logger.log('Request [{0}]"{1}" succeeded: {3}'.format(
                    settings.method,
                    settings.url,
                    textStatus ? textStatus : 'ok.'
                ));

                executeSequence.call(this, sequence, 'done', data, jqXHR, request, returnAsync);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                self._logger.log('<error>Request [{0}]"{1}" failed: ({2}) {3}'.format(
                    settings.method,
                    settings.url,
                    errorThrown ? errorThrown : 500,
                    textStatus ? textStatus : 'error.'
                ));

                executeSequence.call(this, sequence, 'fail', {}, jqXHR, request, returnAsync);
            })
            .always(function(data, textStatus, jqXHR) {
                executeSequence.call(this, sequence, 'always', data, jqXHR, request, returnAsync);
            })
        ;
    });
}

/**
 * Execute a sequence.
 *
 * @param {danf:event.sequence} sequence The sequence.
 * @param {string} state The processed state.
 * @param {object} data The data.
 * @param {object} jqXHR The XHR request object.
 * @api private
 */
var executeSequence = function(sequence, state, data, jqXHR, request, returnAsync) {
    if (state === parameters.process) {
        if ('GET' === request.method) {
            this._history.push(request.path);
        }

        if ('always' === state) {
            state = 'done';

            // Handle fail case.
            if ('object' !== typeof jqXHR) {
                jqXHR = data;
                data = {};
                state = 'fail';
            }
        }

        sequence.execute(
            data,
            {
                request: request,
                state: state,
                status: jqXHR.status
            },
            '.',
            function(stream) {
                returnAsync(stream);
            }
        );
    }
}
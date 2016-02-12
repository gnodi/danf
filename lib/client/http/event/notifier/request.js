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
 * JQuery.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(Request.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * Logger.
 *
 * @var {danf:logging.logger}
 * @api public
 */
Object.defineProperty(Request.prototype, 'logger', {
    set: function(logger) { this._logger = logger; }
});

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
            type: 'string',
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
 * @inheritdoc
 */
Request.prototype.notifyEvent = function(name, parameters, sequence, data) {
    var self = this,
        $ = this._jquery,
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
    if ('GET' === settings.method) {
        var urlParts = url.split('?'),
            path = urlParts[0],
            search = urlParts[1] || '',
            querystring = '',
            query = search.split('&')
        ;

        if (search) {
            // Remove duplicated parameters.
            for (var i = 0; i < query.length; i++) {
                var queryParameter = query[i].split('=');

                if (undefined === settings.data[queryParameter[0]]) {
                    querystring += queryParameter[0];

                    if (queryParameter[1]) {
                        querystring += '={0}'.format(queryParameter[1]);
                    }
                }
            }
        }

        for (var key in settings.data) {
            querystring += key;

            if (null != settings.data[key]) {
                querystring += '={0}'.format(settings.data[key]);
            }
        }

        settings.data = {};

        settings.url = '{0}{1}'.format(
            path,
            '' !== querystring ? '?{0}'.format(querystring) : ''
        );
    } else {
        settings.url = url;
    }

    // Build request.
    var request = utils.merge(
            data,
            {settings: settings}
        )
    ;

    // Process request.
    this.__asyncProcess(function(async) {
        $.ajax(settings)
            .done(function(data, textStatus, jqXHR) {
                self._logger.log(
                    'Request [{0}]"{1}" succeeded: {2}'.format(
                        settings.method,
                        settings.url,
                        textStatus ? textStatus : 'ok.'
                    ),
                    1,
                    0
                );

                executeSequence(sequence, parameters, 'done', data, jqXHR, request, async);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                self._logger.log(
                    '<<error>>Request [{0}]"{1}" failed: ({2}) {3}'.format(
                        settings.method,
                        settings.url,
                        errorThrown ? errorThrown : 500,
                        textStatus ? textStatus : 'error.'
                    ),
                    1,
                    0
                );

                executeSequence(sequence, parameters, 'fail', {}, jqXHR, request, async);
            })
            .always(function(data, textStatus, jqXHR) {
                executeSequence(sequence, parameters, 'always', data, jqXHR, request, async);
            })
        ;
    });
}

/**
 * Execute a sequence.
 *
 * @param {danf:sequencing.sequence} sequence The sequence.
 * @param {object} parameters The request parameters.
 * @param {string} state The processed state.
 * @param {object} data The data.
 * @param {object} jqXHR The XHR request object.
 * @param {object} request The request.
 * @param {function} async The async wrapper.
 * @api private
 */
var executeSequence = function(sequence, parameters, state, data, jqXHR, request, async) {
    if (state === parameters.process) {
        if ('always' === state) {
            state = 'done';

            // Handle fail case.
            if ('object' !== typeof jqXHR) {
                jqXHR = data;
                data = {};
                state = 'fail';
            }
        }

        var status = jqXHR.status,
            text = data
        ;

        if ('object' !== typeof data) {
            data = {};
        } else {
            text = JSON.stringify(data);
        }

        text = text.toString();

        sequence.execute(
            data,
            {
                request: request,
                response: {
                    state: state,
                    status: status,
                    text: text
                }
            },
            '.',
            null,
            async(function(stream) {
                return {
                    url: request.settings.url,
                    status: status,
                    content: stream,
                    text: text
                };
            })
        );
    }
}
'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    utils = require('../../../common/utils')
;

/**
 * Expose `Html`.
 */
module.exports = Html;

/**
 * Initialize a new html type renderer.
 */
function Html() {
}

Html.defineImplementedInterfaces(['danf:rendering.formatRenderer']);

Html.defineDependency('_errorHandler', 'danf:http.errorHandler');

/**
 * Error handler.
 *
 * @var {danf:http.errorHandler}
 * @api public
 */
Object.defineProperty(Html.prototype, 'errorHandler', {
    set: function(errorHandler) { this._errorHandler = errorHandler; }
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Html.prototype, 'format', {
    value: 'html'
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Html.prototype, 'contentTypeHeader', {
    value: 'text/html'
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Html.prototype, 'contract', {
    get: function() {
        return {
            layout: {
                type: 'embedded',
                default: {},
                embed: {
                    file: {
                        type: 'string',
                        default: '%danf:rendering.layout%'
                    },
                    embed: {
                        type: 'embedded_object',
                        embed: buildEmbededContract(0, 8)
                    }
                }
            },
            body: {
                type: 'embedded',
                required: true,
                embed: buildEmbededContract(0, 9)
            }
        };
    }
});

/**
 * Build an embedded contract recursively.
 *
 * @param {integer} level The current level of recursion.
 * @param {integer} maxLevel The max level of recursion.
 * @return {object} The embedded contract.
 * @api private
 */
var buildEmbededContract = function(level, maxLevel) {
    var contract = {
            file: {
                type: 'string',
                required: true
            }
        }
    ;

    if (level <= maxLevel) {
        contract.embed = {
            type: 'embedded_object',
            embed: buildEmbededContract(level + 1, maxLevel)
        };
    }

    return contract;
}

/**
 * @interface {danf:rendering.formatRenderer}
 */
Html.prototype.render = function(response, context, config, callback) {
    var viewCallback = callback;

    viewCallback = renderView.call(this, 'layout', response, context, config.layout, viewCallback);
    viewCallback = renderView.call(this, 'body', response, context, config.body, viewCallback);

    viewCallback('', utils.clone(context));
}

/**
 * Render a response for a view.
 *
 * @param {string} name The name of the view.
 * @param {object} response The response.
 * @param {object} context The context.
 * @param {object} config The config.
 * @param {function} callback A callback of which the first passed argument is the rendering result.
 * @api private
 */
var renderView = function(name, response, context, config, callback) {
    var self = this,
        viewCallback = function (content, context) {
            fs.realpath(config.file, function (error, resolvedPath) {
                if (error) {
                    error = self._errorHandler.process(error);
                    response.statusCode = error.status;
                    response.send('{0}: {1}'.format(error.name, error.message));
                } else {
                    response.render(
                        resolvedPath,
                        context,
                        function(error, content) {
                            if (error) {
                                throw error;
                            }

                            if (!context._view) {
                                context._view = {};
                            }
                            context._view[name] = content;

                            callback(content, context);
                        }
                    );
                }
            });
        }
    ;

    for (var key in config.embed) {
        viewCallback = renderView.call(this, key, response, context, config.embed[key], viewCallback);
    }

    return viewCallback;
}
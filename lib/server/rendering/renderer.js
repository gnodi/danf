'use strict';

/**
 * Expose `Renderer`.
 */
module.exports = Renderer;

/**
 * Initialize a new renderer.
 *
 * @param {danf:manipulation.referenceResolver} referenceResolver The reference resolver.
 */
function Renderer(referenceResolver) {
    this._formatRenderers = [];
    if (referenceResolver) {
        this.referenceResolver = referenceResolver;
    }
}

Renderer.defineImplementedInterfaces(['danf:rendering.renderer']);

Renderer.defineDependency('_referenceResolver', 'danf:manipulation.referenceResolver');
Renderer.defineDependency('_formatRenderers', 'danf:rendering.formatRenderer_array');

/**
 * Set the reference resolver.
 *
 * @param {danf:manipulation.referenceResolver}
 * @api public
 */
Object.defineProperty(Renderer.prototype, 'referenceResolver', {
    set: function(referenceResolver) { this._referenceResolver = referenceResolver; }
});

/**
 * Set the format renderers.
 *
 * @param {danf:rendering.formatRenderer_array}
 * @api public
 */
Object.defineProperty(Renderer.prototype, 'formatRenderers', {
    set: function(formatRenderers) {
        for (var i = 0; i < formatRenderers.length; i++) {
            this.addFormatRenderer(formatRenderers[i]);
        }
    }
});

/**
 * @interface {danf:rendering.renderer}
 */
Object.defineProperty(Renderer.prototype, 'contract', {
    get: function() {
        var contract = {};

        for (var i = 0; i < this._formatRenderers.length; i++) {
            var formatRenderer = this._formatRenderers[i];

            contract[formatRenderer.format] = {
                type: 'embedded',
                embed: formatRenderer.contract
            };
        }

        return {
            type: 'embedded',
            embed: contract,
            default: {}
        };
    }
});

/**
 * Add a format renderer.
 *
 * @param {danf:rendering.formatRenderer} formatRenderer The format renderer.
 * @api public
 */
Renderer.prototype.addFormatRenderer = function(formatRenderer) {
    this._formatRenderers.push(formatRenderer);
}

/**
 * @interface {danf:rendering.renderer}
 */
Renderer.prototype.render = function(request, response, context, config, callback) {
    var rendered = false,
        format = context._format;
    ;

    if (null == format) {
        var definedFormats = [];

        for (var definedFormat in config) {
            definedFormats.push(definedFormat);
        }

        format = request.accepts(definedFormats);
    }

    if (null != format && '*/*' != format) {
        context = resolveContext.call(this, context, context);
        rendered = this.renderFormat(format, response, context, config, callback);
    } else if (0 === definedFormats.length) {
        callback('');
    }

    if (0 !== definedFormats.length && !rendered) {
        throw new Error(406);
    }
}

/**
 * Render a response for a format.
 *
 * @param {string} format The format.
 * @param {danf:http.response} response The response.
 * @param {object} context The context.
 * @param {object} config The config.
 * @param {function} callback A callback of which the first passed argument is the rendering result.
 * @return {boolean} True if the rendering is ok, false otherwise.
 * @api protected
 */
Renderer.prototype.renderFormat = function(format, response, context, config, callback) {
    for (var i = 0; i < this._formatRenderers.length; i++) {
        var formatRenderer = this._formatRenderers[i];

        if (format === formatRenderer.format) {
            if (null != config[format]) {
                response.set('Content-Type', formatRenderer.contentTypeHeader);
                formatRenderer.render(response, context, config[format], callback);

                return true;
            }
        }
    }

    return false;
}

/**
 * Resolve the context.
 *
 * @param {mixed} value The value to resolve.
 * @param {object} context The context.
 * @retrun {object} context The resolved context.
 * @api private
 */
var resolveContext = function(value, context) {
    switch (typeof value) {
        case 'string':
            return this._referenceResolver.resolve(value, '@', context);
        case 'object':
            for (var key in value) {
                value[key] = resolveContext.call(this, value[key], context);
            }

            break;
    }

    return value;
}
'use strict';

/**
 * Expose `Json`.
 */
module.exports = Json;

/**
 * Initialize a new json type renderer.
 */
function Json() {
}

Json.defineImplementedInterfaces(['danf:rendering.formatRenderer']);

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Json.prototype, 'format', {
    value: 'json'
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Json.prototype, 'contentTypeHeader', {
    value: 'application/json'
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Object.defineProperty(Json.prototype, 'contract', {
    value: {
        select: {
            type: 'string_array',
            default: []
        }
    }
});

/**
 * @interface {danf:rendering.formatRenderer}
 */
Json.prototype.render = function(response, context, config, callback) {
    var select = config.select;

    var rendering = {};

    if (0 !== select.length) {
        for (var key in select) {
            var field = select[key];

            rendering[field] = context[field];
        }
    } else {
        rendering = context;
    }

    callback(JSON.stringify(rendering));
}
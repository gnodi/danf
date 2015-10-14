'use strict';

/**
 * Expose `History`.
 */
module.exports = History;

/**
 * Initialize a new history.
 */
function History() {
}

History.defineImplementedInterfaces(['danf:manipulation.history']);

History.defineDependency('_jquery', 'function');
History.defineDependency('_bodyProvider', 'danf:manipulation.bodyProvider');
History.defineDependency('_readyProcessor', 'danf:manipulation.readyProcessor');

/**
 * JQuery.
 *
 * @var {function}
 * @api public
 */
Object.defineProperty(History.prototype, 'jquery', {
    set: function(jquery) { this._jquery = jquery; }
});

/**
 * Body provider.
 *
 * @var {danf:manipulation.bodyProvider}
 * @api public
 */
Object.defineProperty(History.prototype, 'bodyProvider', {
    set: function(bodyProvider) { this._bodyProvider = bodyProvider; }
});

/**
 * Ready processor.
 *
 * @var {danf:manipulation.readyProcessor}
 * @api public
 */
Object.defineProperty(History.prototype, 'readyProcessor', {
    set: function(readyProcessor) { this._readyProcessor = readyProcessor; }
});

/**
 * @interface {danf:manipulation.history}
 */
History.prototype.initialize = function() {
    if (null == window.history.state) {
        var path = getCurrentPath();

        this.replace(
            path,
            {
                path: path,
                content: getBodyContent.call(this)
            }
        );
    }
}

/**
 * @interface {danf:manipulation.history}
 */
History.prototype.push = function(path, state) {
    if (window.history.pushState) {
        state = state || {};
        state.path = path;
        state.content = getBodyContent.call(this);

        window.history.pushState(
            state,
            '',
            null != path ? path : getCurrentPath()
        );
    }
}

/**
 * @interface {danf:manipulation.history}
 */
History.prototype.replace = function(path, state) {
    if (window.history.replaceState) {
        state = state || {};
        state.path = path;
        state.content = getBodyContent.call(this);

        window.history.replaceState(
            state,
            '',
            null != path ? path : getCurrentPath()
        );
    }
}

/**
 * @interface {danf:manipulation.history}
 */
History.prototype.set = function(path, state) {
    if (window.history.state && window.history.state.path === path) {
        this.replace(path, state);
    } else {
        this.push(path, state);
    }
}

/**
 * @interface {danf:manipulation.history}
 */
History.prototype.navigate = function(state) {
    var $ = this._jquery,
        content = state.content,
        body = $(document.body)
    ;

    if (content) {
        if (body.html() !== content) {
            body.html(content);

            // Trigger an ajax ready event with the new integrated
            // data as scope.
            this._readyProcessor.process(body);
        }
    }
}

/**
 * Retrieve the body content.
 *
 * @return {string} The body content.
 * @api private
 */
var getBodyContent = function() {
    return this._jquery(document.body).html();
}

/**
 * Retrieve the current path.
 *
 * @return {string} The current path.
 * @api private
 */
var getCurrentPath = function() {
    return '{0}{1}'.format(window.location.pathname, window.location.search);
}
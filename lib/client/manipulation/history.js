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

History.defineDependency('_bodyProvider', 'danf:ajaxApp.bodyProvider');
History.defineDependency('_readyTrigger', 'danf:ajaxApp.readyTrigger');

/**
 * Set the body provider.
 *
 * @param {danf:ajaxApp.bodyProvider}
 * @api public
 */
Object.defineProperty(History.prototype, 'bodyProvider', {
    set: function(bodyProvider) { this._bodyProvider = bodyProvider; }
});

/**
 * Set the ready trigger.
 *
 * @param {danf:ajaxApp.readyTrigger}
 * @api public
 */
Object.defineProperty(History.prototype, 'readyTrigger', {
    set: function(readyTrigger) { this._readyTrigger = readyTrigger; }
});

/**
 * @interface {danf:manipulation.history}
 */
History.prototype.initialize = function() {
    if (null == window.history.state) {
        this.replace(
            {content: getBodyContent.call(this)},
            getCurrentPath()
        );
    }
}

/**
 * @interface {danf:manipulation.history}
 */
History.prototype.push = function(path, state) {
    if (window.history.pushState) {
        state = state || {};
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
HistoryHandler.prototype.navigate = function(state) {
    var content = state.content,
        body = this._bodyProvider.provide()
    ;

    if (content) {
        if (body.html() !== content) {
            body.html(content);

            // Trigger an ajax ready event with the new integrated
            // data as scope.
            this._readyTrigger.trigger({scope: body});
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
    return this._bodyProvider.provide().html();
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
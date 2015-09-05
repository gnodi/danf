'use strict';

/**
 * Expose `SessionHandler`.
 */
module.exports = SessionHandler;

/**
 * Initialize a new session handler.
 */
function SessionHandler() {
}

SessionHandler.defineImplementedInterfaces(['danf:http.sessionHandler']);

SessionHandler.defineDependency('_flowContext', 'danf:event.flowContext');

/**
 * Set the flow context.
 *
 * @param {danf:event.flowContext}
 * @api public
 */
Object.defineProperty(SessionHandler.prototype, 'flowContext', {
    set: function(flowContext) { this._flowContext = flowContext; }
});

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.get = function(key) {
    var session = getSession.call(this);

    return session[key];
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.set = function(key, value) {
    var session = getSession.call(this);

    session[key] = value;
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.regenerate = function() {
    var session = getSession.call(this);

    this.__asyncProcess(function(returnAsync) {
        session.regenerate(returnAsync);
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.destroy = function() {
    var session = getSession.call(this);

    this.__asyncProcess(function(returnAsync) {
        session.destroy(returnAsync);
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.reload = function() {
    var session = getSession.call(this);

    this.__asyncProcess(function(returnAsync) {
        session.reload(returnAsync);
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.save = function() {
    var session = getSession.call(this);

    this.__asyncProcess(function(returnAsync) {
        session.save(returnAsync);
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.touch = function() {
    var session = getSession.call(this);

    this.__asyncProcess(function(returnAsync) {
        session.touch(returnAsync);
    });
}

/**
 * Get the session.
 *
 * @return {object} The session.
 * @api private
 */
var getSession = function() {
    var request = this._flowContext.get('request');

    if (undefined === request.session) {
        throw new Error('The session does not exist or has been destroyed.');
    }

    return request.session;
}
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

SessionHandler.defineDependency('_flowContext', 'danf:sequencing.flowContext');

/**
 * Flow context.
 *
 * @var {danf:sequencing.flowContext}
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

    this.__asyncProcess(function(async) {
        session.regenerate(async());
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.destroy = function() {
    var session = getSession.call(this);

    this.__asyncProcess(function(async) {
        session.destroy(async());
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.reload = function() {
    var session = getSession.call(this);

    this.__asyncProcess(function(async) {
        session.reload(async());
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.save = function() {
    var session = getSession.call(this);

    this.__asyncProcess(function(async) {
        session.save(async());
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.touch = function() {
    var session = getSession.call(this);

    this.__asyncProcess(function(async) {
        session.touch(async());
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
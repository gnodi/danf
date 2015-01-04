'use strict';

/**
 * Expose `SessionHandler`.
 */
module.exports = SessionHandler;

/**
 * Initialize a new session handler.
 *
 * @param {danf:dependencyInjection.contextProvider<danf:http.request>} requestProvider The request provider.
 * @param {danf:dependencyInjection.contextProvider<danf:manipulation.sequencer>} sequencerProvider The provider of current sequencer.
 */
function SessionHandler(requestProvider, sequencerProvider) {
    if (requestProvider) {
        this.requestProvider = requestProvider;
    }
    if (sequencerProvider) {
        this.sequencerProvider = sequencerProvider;
    }
}

SessionHandler.defineImplementedInterfaces(['danf:http.sessionHandler']);

SessionHandler.defineDependency('_requestProvider', 'danf:dependencyInjection.contextProvider', 'danf:http.request');
SessionHandler.defineDependency('_sequencerProvider', 'danf:dependencyInjection.contextProvider', 'danf:manipulation.sequencer');

/**
 * Set the request provider.
 *
 * @param {danf:manipulation.contextProvider<danf:http.request>}
 * @api public
 */
Object.defineProperty(SessionHandler.prototype, 'requestProvider', {
    set: function(requestProvider) { this._requestProvider = requestProvider; }
});

/**
 * Set the provider of current sequencer.
 *
 * @param {danf:dependencyInjection.contextProvider<danf:manipulation.sequencer>} sequencerProvider The provider of current sequencer.
 * @api public
 */
Object.defineProperty(SessionHandler.prototype, 'sequencerProvider', {
    set: function(sequencerProvider) { this._sequencerProvider = sequencerProvider; }
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
    var session = getSession.call(this),
        sequencer = this._sequencerProvider.provide(),
        taskId = sequencer.wait()
    ;

    session.regenerate(function() {
        sequencer.end(taskId);
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.destroy = function() {
    var session = getSession.call(this),
        sequencer = this._sequencerProvider.provide(),
        taskId = sequencer.wait()
    ;

    session.destroy(function() {
        sequencer.end(taskId);
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.reload = function() {
    var session = getSession.call(this),
        sequencer = this._sequencerProvider.provide(),
        taskId = sequencer.wait()
    ;

    session.reload(function() {
        sequencer.end(taskId);
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.save = function() {
    var session = getSession.call(this),
        sequencer = this._sequencerProvider.provide(),
        taskId = sequencer.wait()
    ;

    session.save(function() {
        sequencer.end(taskId);
    });
}

/**
 * @interface {danf:http.sessionHandler}
 */
SessionHandler.prototype.touch = function() {
    var session = getSession.call(this),
        sequencer = this._sequencerProvider.provide(),
        taskId = sequencer.wait()
    ;

    session.touch(function() {
        sequencer.end(taskId);
    });
}

/**
 * Get the session.
 *
 * @return {object} The session.
 * @api private
 */
var getSession = function() {
    var request = this._requestProvider.provide();

    if (undefined === request.session) {
        throw new Error('The session does not exist or has been destroyed.');
    }

    return request.session;
}
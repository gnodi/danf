'use strict';

/**
 * Expose `Redirector`.
 */
module.exports = Redirector;

/**
 * Initialize a new redirector.
 */
function Redirector() {
}

Redirector.defineImplementedInterfaces(['danf:http.redirector']);

/**
 * @interface {danf:error.errorHandler}
 */
Redirector.prototype.redirect = function(url, status) {
    // Redirection is handled as an error to interrupt the flow.
    var error = new Error();

    error.status = null != status ? status : 302;
    error.message = url;

    throw error;
}
'use strict';

// Define "define" for the client or the server.
var define = define ? define : require('amdefine')(module);

// Wrapper allowing to use the class on both the client and server sides.
define(function(require) {
    /**
     * Initialize a new logger.
     */
    function Logger() {}

    Logger.defineImplementedInterfaces(['logger']);

    /**
     * @interface {logger}
     */
    Logger.prototype.log = function(message) {
        console.log(message);
    }

    /**
     * Expose `Logger`.
     */
    return Logger;
});
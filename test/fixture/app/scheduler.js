'use strict';

module.exports = Scheduler;

function Scheduler() {}

Scheduler.prototype.start = function (value, inc, timeout) {
    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(function(value) {
                    return value + inc;
                });
            },
            timeout + 20
        );
    });

    this.__asyncProcess(function(returnAsync) {
        setTimeout(
            function() {
                returnAsync(function(value) {
                    return value + inc;
                });
            },
            timeout
        );
    });

    return value + inc;
}
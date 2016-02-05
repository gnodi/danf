'use strict';

module.exports = Scheduler;

function Scheduler() {}

Scheduler.prototype.start = function (value, inc, timeout) {
    this.__asyncProcess(function(async) {
        setTimeout(
            async(function() {
                return function(value) {
                    return value + inc;
                };
            }),
            timeout + 20
        );
    });

    this.__asyncProcess(function(async) {
        setTimeout(
            async(function() {
                return function(value) {
                    return value + inc;
                };
            }),
            timeout
        );
    });

    return value + inc;
}
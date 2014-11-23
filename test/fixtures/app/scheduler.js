'use strict';

module.exports = Scheduler;

function Scheduler() {}

Scheduler.prototype.start = function (value, inc, timeout) {
    var sequencer = this.currentSequencerProvider.provide();

    var firstInc = sequencer.wait();

    setTimeout(
        function() {
            sequencer.end(firstInc, function(value) {
                return value + inc;
            });
        },
        timeout + 20
    );

    var secondInc = sequencer.wait();

    setTimeout(
        function() {
            sequencer.end(secondInc, function(value) {
                return value + inc;
            });
        },
        timeout
    );

    return value + inc;
}
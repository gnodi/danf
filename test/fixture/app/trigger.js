'use strict';

var Trigger = function() {};

Trigger.prototype.trigger = function(done) {
    this.startEvent.trigger();
    this.startDependencyEvent.trigger({data: {i: 3, done: done}});
};

module.exports = Trigger;
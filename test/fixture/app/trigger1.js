'use strict';

var Trigger = function() {};

Trigger.prototype.trigger = function(done) {
    this.startEvent.trigger({data: {i: 2, done: done}});
};

module.exports = Trigger;
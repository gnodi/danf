'use strict';

var Trigger = function() {};

Trigger.prototype.trigger = function(done) {
    this.eventsHandler.trigger('event', 'start', this);
    this.eventsHandler.trigger('event', 'dep1:start', this, {i: 3, done: done});
};

module.exports = Trigger;
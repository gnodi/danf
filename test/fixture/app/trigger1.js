'use strict';

var Trigger = function() {};

Trigger.prototype.trigger = function(done) {
    this.eventsHandler.trigger('event', 'start', this, {i: 2, done: done});
};

module.exports = Trigger;
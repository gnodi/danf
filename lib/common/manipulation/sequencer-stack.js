'use strict';

/**
 * Expose `SequencerStack`.
 */
module.exports = SequencerStack;

/**
 * Initialize a new sequencer stack.
 */
function SequencerStack() {
    this._stack = [];
}

SequencerStack.defineImplementedInterfaces(['danf:manipulation.sequencerStack']);

/**
 * @interface {danf:manipulation.sequencerStack}
 */
SequencerStack.prototype.push = function(sequencer) {
    this._stack.push({
        sequencer: sequencer,
        ended: false
    });
}

/**
 * @interface {danf:manipulation.sequencerStack}
 */
SequencerStack.prototype.free = function(sequencer) {
    // Set the sequencer as ended.
    for (var i = 0; i < this._stack.length; i++) {
        if (this._stack[i].sequencer === sequencer) {
            this._stack[i].ended = true;
        }
    }

    // Free the stack.
    for (var i = this._stack.length - 1; i >= 0; i--) {
        if (this._stack[i].ended) {
            this._stack.pop();
        } else {
            break;
        }
    }
}

/**
 * @interface {danf:manipulation.sequencerStack}
 */
SequencerStack.prototype.retrieveGlobalContexts = function() {
    var context = [];

    for (var i = 0; i < this._stack.length; i++) {
        context.push(this._stack[i].sequencer.globalContext);
    }

    return context;
}

/**
 * @interface {danf:manipulation.sequencerStack}
 */
SequencerStack.prototype.retrieveStreamContexts = function() {
    var context = [];

    for (var i = 0; i < this._stack.length; i++) {
        context.push(this._stack[i].sequencer.streamContext);
    }

    return context;
}
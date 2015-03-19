'use strict';

/**
 * Expose `Sequencer`.
 */
module.exports = Sequencer;

/**
 * Initialize a new sequencer.
 */
function Sequencer() {
    this._callbacks = [];
    this._streamContext;
    this._globalContext = [];
    this._counter = 0;
    this._waitedTasks = {};
    this._sequencerStack;
}

Sequencer.defineImplementedInterfaces(['danf:manipulation.sequencer']);

/**
 * @interface {danf:manipulation.sequencer}
 */
Object.defineProperty(Sequencer.prototype, 'sequencerStack', {
    get: function() { return this._sequencerStack; },
    set: function(sequencerStack) { this._sequencerStack = sequencerStack; }
});

/**
 * @interface {danf:manipulation.sequencer}
 */
Object.defineProperty(Sequencer.prototype, 'streamContext', {
    get: function() { return this._streamContext; }
});


/**
 * @interface {danf:manipulation.sequencer}
 */
Object.defineProperty(Sequencer.prototype, 'globalContext', {
    get: function() { return this._globalContext; }
});

/**
 * @interface {danf:manipulation.sequencer}
 */
Sequencer.prototype.pipe = function(callback, scope) {
    if (Object.isInstanceOf(callback, 'danf:manipulation.sequencer')) {
        var self = this,
            sequencer = callback
        ;

        callback = function(stream) {
            var task = self.wait();

            sequencer.start(stream, function(stream) {
                self.end(task, function() {
                    return stream;
                });
            });
        };
    } else {
        Object.checkType(callback, 'function');
    }

    callback.scope = scope;
    this._callbacks.push(callback);
}

/**
 * @interface {danf:manipulation.sequencer}
 */
Sequencer.prototype.addGlobalContext = function(callback) {
    this._globalContext.push(callback);
}

/**
 * @interface {danf:manipulation.sequencer}
 */
Sequencer.prototype.start = function(stream, callback, context) {
    var streamContext = {
            index: -1,
            callback: callback,
            setter: context,
            tasks: {},
            stream: stream
        }
    ;

    if (this._sequencerStack) {
        streamContext.stack = {
            global: this._sequencerStack.retrieveGlobalContexts(),
            stream: this._sequencerStack.retrieveStreamContexts()
        };
    }

    executeNext.call(
        this,
        streamContext
    );
}

/**
 * @interface {danf:manipulation.sequencer}
 */
Sequencer.prototype.wait = function() {
    this._counter++;

    if (this._counter === Number.MAX_VALUE) {
        this._counter = 0;
    }

    this._streamContext.tasks[this._counter] = true;
    this._waitedTasks[this._counter] = this._streamContext;

    return this._counter;
}

/**
 * @interface {danf:manipulation.sequencer}
 */
Sequencer.prototype.end = function(task, callback) {
    if (!this._waitedTasks[task]) {
        throw new Error('The task "{0}" has not been started.'.format(task));
    }

    var context = this._waitedTasks[task],
        stream = context.stream
    ;

    delete this._waitedTasks[task];
    delete context.tasks[task];

    if (callback) {
        Object.checkType(callback, 'function');

        context.stream = executeCallback.call(this, callback, context);
    }

    if (0 === Object.keys(context.tasks).length) {
        context.scope = null;

        executeNext.call(this, context);
    }
}

/**
 * Execute the next callback.
 *
 * @param {object}
 */
var executeNext = function(context) {
    var index = ++context.index;

    this._streamContext = context;

    // No more callback to proceed. End of the sequence.
    if (index >= this._callbacks.length) {
        if (context.callback) {
            context.scope = null;
            executeCallback.call(this, context.callback, context);
            this._streamContext = null;
        }
    } else {
        var task = this.wait();

        context.scope = this._callbacks[index].scope;
        var callback = executeCallback.call(this, this._callbacks[index], context, false);

        this.end(task, callback);
    }
}

/**
 * Set the global context.
 */
var setGlobalContext = function(globalContext, reset) {
    reset = reset ? true : false;

    for (var i = 0; i < globalContext.length; i++) {
        globalContext[i](reset);
    }
}

/**
 * Set the context.
 */
var setContext = function(context, reset) {
    if (this._sequencerStack) {
        if (!reset) {
            this._sequencerStack.push(this);
        }

        for (var i = 0; i < context.stack.global.length; i++) {
            setGlobalContext(context.stack.global[i], reset);
        }
    }

    setGlobalContext(this._globalContext, reset);

    if (this._sequencerStack) {
        for (var i = 0; i < context.stack.stream.length; i++) {
            var streamContext = context.stack.stream[i];

            if (streamContext.setter) {
                streamContext.setter.call(this, reset);
            }
        }

        if (reset) {
            this._sequencerStack.free(this);
        }
    }

    if (context.setter) {
        context.setter.call(this, reset);
    }
}

/**
 * Execute a callback.
 */
var executeCallback = function(callback, context, useScope) {
    var stream = context.stream,
        scope = context.scope
    ;

    useScope = useScope || undefined === useScope ? true : false;
    this._streamContext = context;

    setContext.call(this, context, false);

    var result;

    if (useScope && scope) {
        var fields = scope.split('.'),
            streamPart = stream,
            field
        ;

        for (var i = 0; i < fields.length; i++) {
            field = fields[i];

            if (i >= fields.length - 1) {
                break;
            } else {
                if (undefined === streamPart[field]) {
                    streamPart[field] = {};
                }

                streamPart = streamPart[field];
            }
        }

        var callbackWrapper = function(stream, callback) {
            streamPart[field] = callback(streamPart[field]);

            return stream;
        };

        result = callbackWrapper(stream, callback);
    } else {
        result = callback(stream);
    }

    setContext.call(this, context, true);

    return result;
}
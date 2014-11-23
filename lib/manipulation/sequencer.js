'use strict';

var define = define ? define : require('amdefine')(module);

define(function(require) {
    /**
     * Initialize a new sequencer.
     */
    function Sequencer() {
        this._callbacks = [];
        this._context;
        this._contexts = [];
        this._counter = 0;
        this._waitedTasks = {};
    }

    Sequencer.defineImplementedInterfaces(['danf:manipulation.sequencer']);

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
        this._contexts.push(callback);
    }

    /**
     * @interface {danf:manipulation.sequencer}
     */
    Sequencer.prototype.start = function(stream, callback, context) {
        Object.checkType(callback, 'function|undefined');
        Object.checkType(context, 'function|undefined');

        executeNext.call(
            this,
            {
                index: -1,
                callback: callback,
                setter: context,
                tasks: {},
                stream: stream
            }
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

        this._context.tasks[this._counter] = true;
        this._waitedTasks[this._counter] = this._context;

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

        this._context = context;

        // No more callback to proceed. End of the sequence.
        if (index >= this._callbacks.length) {
            if (context.callback) {
                context.scope = null;
                executeCallback.call(this, context.callback, context);
                this._context = null;
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
    var setGlobalContext = function(reset) {
        reset = reset ? true : false;

        for (var i = 0; i < this._contexts.length; i++) {
            this._contexts[i](reset);
        }
    }

    /**
     * Execute a callback.
     */
    var executeCallback = function(callback, context, useScope) {
        var setter = context.setter,
            stream = context.stream,
            scope = context.scope
        ;

        useScope = useScope || undefined === useScope ? true : false;

        setGlobalContext.call(this);
        if (setter) {
            setter.call(this);
        }

        var result;
        this._context = context;

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

        if (setter) {
            setter.call(this, true);
        }
        setGlobalContext.call(this, true);

        return result;
    }

    /**
     * Expose `Sequencer`.
     */
    return Sequencer;
});
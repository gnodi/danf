'use strict';

/**
 * Expose `Flow`.
 */
module.exports = Flow;

/**
 * Initialize a new flow.
 *
 * @param {object} stream The stream.
 * @param {function} callback A callback called at the end of the flow.
 */
function Flow(stream, callback, checkInput) {
    Object.checkType(stream, 'object');
    Object.checkType(callback, 'function');

    this._counter = 0;
    this._tasks = {};
    this._callback = callback;
    this._stream = stream;
    this._hasEnded = false;
}

Flow.defineImplementedInterfaces(['danf:manipulation.flow']);

/**
 * @interface {danf:manipulation.flow}
 */
Object.defineProperty(Flow.prototype, 'stream', {
    get: function() { return this._stream; }
});

/**
 * @interface {danf:manipulation.flow}
 */
Flow.prototype.wait = function() {
    if (this._hasEnded) {
        throw new Error('Cannot wait for a task on an already ended flow.')
    }

    var task = this._counter++;

    this._tasks[task] = true;

    return task;
}

/**
 * @interface {danf:manipulation.flow}
 */
Flow.prototype.end = function(task, returnedValue) {
    if (this._hasEnded) {
        throw new Error('A task has been ended on an already ended flow.')
    }


    delete this._tasks[task];

    var hasEnded = true;

    if ('function' === typeof returnedValue) {
        returnedValue = returnedValue(this._stream);
    }

    for (var i = 0; i <= this._counter; i++) {
        if (undefined !== this._tasks[i]) {
            hasEnded = false;
            break;
        }
    }

    if (hasEnded) {
        this._hasEnded = true;
        this._callback(null, returnedValue);
    }
}
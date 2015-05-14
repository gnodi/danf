'use strict';

/**
 * Expose `Flow`.
 */
module.exports = Flow;

/**
 * Initialize a new flow.
 *
 * @param {object} stream The stream.
 * @param {object} scope The initial scope.
 * @param {function} callback A callback called at the end of the flow.
 */
function Flow(stream, scope, callback) {
    Object.checkType(callback, 'function');

    this._stream = stream;
    this._mainStream = stream;
    this._taskCounter = 0;
    this._tributaryCounter = 0;
    this._tributaries = {};
    this.addTributary(scope);
    this._callback = callback;
    this._hasEnded = false;
}

Flow.defineImplementedInterfaces(['danf:manipulation.flow']);

/**
 * @interface {danf:manipulation.flow}
 */
Object.defineProperty(Flow.prototype, 'stream', {
    get: function() { return this._mainStream; }
});

/**
 * @interface {danf:manipulation.flow}
 */
Flow.prototype.wait = function() {
    if (this._hasEnded) {
        throw new Error('Cannot wait for a task on an already ended flow.')
    }

    var task = this._taskCounter++;

    this._tasks[task] = true;

    return task;
}

/**
 * @interface {danf:manipulation.flow}
 */
Flow.prototype.end = function(task, returnedValue) {
    if (this._hasEnded) {
        throw new Error('Cannot end a task on an already ended flow.')
    }

    var currentTributary = this._currentTributary;

    for (var i = 0; i < this._tributaryCounter; i++) {
        var tributaryData = this._tributaries[i];

        if (undefined !== tributaryData && undefined !== tributaryData.tasks[task]) {
            this.setTributary(i);
            break;
        }
    }

    delete this._tasks[task];

    if ('function' === typeof returnedValue && undefined === returnedValue._returnedFunction) {
        returnedValue = returnedValue(this._stream);
    }

    var tributaryData = this._tributaries[this._currentTributary];

    if (undefined !== returnedValue) {
        tributaryData.stream = this._stream = returnedValue;
    }

    var hasEnded = tryTributaryDeletion.call(this, this._currentTributary);

    // Prevent processing a new end if the end has been triggered by a
    // tributary callback.
    if (hasEnded && !this._hasEnded) {
        var hasAllEnded = true;

        for (var i = 0; i < this._tributaryCounter; i++) {
            if (undefined !== this._tributaries[i]) {
                hasAllEnded = false;
                break;
            }
        }

        if (hasAllEnded) {
            if (task === 2) {
                throw new Error('plip');
            }
            this._hasEnded = true;
            this._callback(null, this._mainStream);
        }
    }

    // Reset current tributary.
    if (undefined !== this._tributaries[currentTributary]) {
        this.setTributary(currentTributary);
    } else if (tributaryData.parent) {
        this.setTributary(mergedTributaryData.parent);
    }
}

/**
 * @interface {danf:manipulation.flow}
 */
Flow.prototype.addTributary = function(scope, callback) {
    if (this._hasEnded) {
        throw new Error('Cannot add a tributary on an already ended flow.')
    }

    var tributary = this._tributaryCounter++;

    this._tasks = {};

    if (scope) {
        if (null != this._stream && 'object' !== typeof this._stream) {
            throw new Error('Cannot set a scope for a tributary with a non object stream.')
        }

        if (null != this._stream) {
            var scopePaths = extractScopePaths(scope),
                scopePath
            ;

            while (scopePath = scopePaths.shift()) {
                if (null != this._stream[scopePath]) {
                    this._stream = this._stream[scopePath];
                } else {
                    this._stream = null;
                    break;
                }
            }
        }
    }

    this._tributaries[tributary] = {
        tasks: this._tasks,
        stream: this._stream,
        scope: scope,
        parent: this._currentTributary,
        callback: callback
    };

    this._currentTributary = tributary;

    return tributary;
}

/**
 * @interface {danf:manipulation.flow}
 */
Flow.prototype.setTributary = function(tributary) {
    if (this._hasEnded) {
        throw new Error('Cannot set a tributary on an already ended flow.')
    }
    if (undefined === this._tributaries[tributary]) {
        throw new Error('No existing tributary "{0}".'.format(tributary));
    }

    var currentTributaryData = this._tributaries[tributary];

    this._tasks = currentTributaryData.tasks;
    this._stream = currentTributaryData.stream;
    this._currentTributary = tributary;
}

/**
 * @interface {danf:manipulation.flow}
 */
Flow.prototype.mergeTributary = function(tributary) {
    if (
        !this._hasEnded &&
        this._tributaries[tributary] &&
        this._currentTributary === tributary
    ) {
        var mergedTributaryData = this._tributaries[tributary];

        this.setTributary(mergedTributaryData.parent);
    }
}

/**
 * Delete a tributary.
 *
 * @param {number} tributary The tributary.
 * @return {boolean} Whether or not the tributary has been deleted.
 * @api private
 */
var tryTributaryDeletion = function(tributary) {
    var tributaryData = this._tributaries[tributary],
        hasEnded = true
    ;

    for (var i = 0; i <= this._taskCounter; i++) {
        if (undefined !== tributaryData.tasks[i]) {
            hasEnded = false;
            break;
        }
    }

    // Handle no remaining task in the tributary case.
    if (hasEnded) {
        var hasChildrenEnded = true;

        for (var i = 0; i <= this._tributaryCounter; i++) {
            var otherTributaryData = this._tributaries[i];

            if (undefined !== otherTributaryData && otherTributaryData.parent === tributary) {
                hasChildrenEnded = false;
                break;
            }
        }

        // Handle no remaining children tributary case.
        if (hasChildrenEnded) {
            // Delete the tributary.
            delete this._tributaries[tributary];

            if (undefined !== tributaryData.parent) {
                var parentTributaryData = this._tributaries[tributaryData.parent];

                if (tributaryData.scope) {
                    var scopePaths = extractScopePaths(tributaryData.scope),
                        scopePath,
                        stream = parentTributaryData.stream || {},
                        streamRoot = stream
                    ;

                    for (var i = 0; i < scopePaths.length; i++) {
                        var scopePath = scopePaths[i];

                        if (i === scopePaths.length - 1) {
                            stream[scopePath] = tributaryData.stream;
                        } else if (null == stream[scopePath]) {
                            stream[scopePath] = {};
                        }

                        stream = stream[scopePath];
                    }

                    parentTributaryData.stream = streamRoot;
                } else {
                    parentTributaryData.stream = tributaryData.stream;
                }

                // Try to delete parent.
                tryTributaryDeletion.call(this, tributaryData.parent);
            } else {
                if (tributaryData.scope) {
                    this._mainStream[tributaryData.scope] = tributaryData.stream;
                } else {
                    this._mainStream = tributaryData.stream;
                }
            }

            if (tributaryData.callback) {
                tributaryData.callback();
            }

            return true;
        }
    }

    return false;
}

/**
 * Extract scope paths from scope.
 *
 * @param {string} scope The scope.
 * @return {string_array} The extracted scope paths.
 * @api private
 */
var extractScopePaths = function(scope) {
    scope = scope.replace(/`([^`]*)`/g, function(match) {
        return match.replace(/\./g, '%;%');
    });

    var scopePaths = scope.split('.');

    for (var i = 0; i < scopePaths.length; i++) {
        scopePaths[i] = scopePaths[i].replace(/%;%/g, '.').replace(/`/g, '');
    }

    return scopePaths;
}

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
 * @param {danf:manipulation.context} context The context.
 * @param {function} callback A callback called at the end of the flow.
 */
function Flow(stream, scope, context, callback) {
    this._context = context;
    this._initialScope = scope;
    this._stream = stream;
    this._mainStream = stream;
    this._taskCounter = 0;
    this._tributaryCounter = 0;
    this._tributaries = {};
    if (undefined !== scope) {
        this.addTributary(scope);
    }
    this._callback = callback;
    this._hasEnded = false;
}

Flow.defineImplementedInterfaces(['danf:manipulation.flow']);

Flow.defineDependency('_context', 'danf:manipulation.map');

/**
 * Init.
 */
Flow.prototype.__init = function() {
    if (undefined === this._currentTributary) {
        this.addTributary(this._initialScope);
    }
}

/**
 * @interface {danf:manipulation.flow}
 */
Object.defineProperty(Flow.prototype, 'context', {
    get: function() { return this._context; },
    set: function(context) { this._context = context; }
});

/**
 * @interface {danf:manipulation.flow}
 */
Object.defineProperty(Flow.prototype, 'stream', {
    get: function() { return this._mainStream; },
    set: function(stream) {
        this._mainStream = stream;
        if (undefined === this._stream) {
            this._stream = stream;
        }
    }
});

/**
 * @interface {danf:manipulation.flow}
 */
Object.defineProperty(Flow.prototype, 'currentStream', {
    get: function() { return this._stream; },
    set: function(stream) {
        var tributaryData = this._tributaries[this._currentTributary];

        tributaryData.stream = stream;
        this._stream = stream;
    }
});

/**
 * @interface {danf:manipulation.flow}
 */
Object.defineProperty(Flow.prototype, 'parentStream', {
    get: function() {
        var tributaryData = this._tributaries[this._currentTributary];

        if (tributaryData.parent) {
            return this._tributaries[tributaryData.parent].stream;
        }

        return this._mainStream;
    }
});

/**
 * Set the initial scope.
 *
 * @param {string|null} scope The scope.
 */
Object.defineProperty(Flow.prototype, 'initialScope', {
    set: function(initialScope) {
        if (undefined !== this._currentTributary) {
            throw new Error(
                'Cannot define initial scope after initialization.'
            );
        }

        this._initialScope = initialScope;
    }
});

/**
 * Set the final callback
 *
 * @param {function|null} callback The callback.
 */
Object.defineProperty(Flow.prototype, 'callback', {
    set: function(callback) { this._callback = callback; }
});

/**
 * @interface {danf:manipulation.flow}
 */
Object.defineProperty(Flow.prototype, 'currentTributary', {
    get: function() { return this._currentTributary; }
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
            this._hasEnded = true;
            this._callback(null, this._mainStream);
        }
    }

    // Reset current tributary.
    if (undefined !== this._tributaries[this._currentTributary]) {
        this.setTributary(this._currentTributary);
    } else if (tributaryData.parent) {
        this.setTributary(tributaryData.parent);
    }
}

/**
 * @interface {danf:manipulation.flow}
 */
Flow.prototype.addTributary = function(scope, format, callback) {
    if (this._hasEnded) {
        throw new Error('Cannot add a tributary on an already ended flow.')
    }

    var tributary = this._tributaryCounter++;

    this._tasks = {};

    if (scope && '.' !== scope) {
        scope = String(scope);

        if (null != this._stream && 'object' !== typeof this._stream) {
            this._stream = null;
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
        format: format,
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

        if (undefined !== mergedTributaryData.parent) {
            this.setTributary(mergedTributaryData.parent);
        }
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

    if (null == tributaryData) {
        return;
    }

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
            this.mergeTributary(tributary);
            delete this._tributaries[tributary];

            if (tributaryData.format) {
                tributaryData.stream = tributaryData.format(tributaryData.stream);
            }

            if (undefined !== tributaryData.parent) {
                var currentTributaryData = tributaryData;

                // Impact parent tributary stream from its child tributary stream.
                while (currentTributaryData) {
                    var parentTributaryData = this._tributaries[currentTributaryData.parent];

                    if (parentTributaryData) {
                        var scope = currentTributaryData.scope;

                        if (scope) {
                            if ('.' !== scope) {
                                var scopePaths = extractScopePaths(scope),
                                    stream = null != parentTributaryData.stream && 'object' === typeof parentTributaryData.stream
                                        ? parentTributaryData.stream
                                        : {}
                                ;

                                if ((Array.isArray(stream[scopePaths[0]]) && scopePath != parseInt(scopePaths[0], 10))) {
                                    stream = {};
                                }

                                var streamRoot = stream,
                                    parentStream = {}
                                ;

                                for (var i = 0; i < scopePaths.length; i++) {
                                    var scopePath = scopePaths[i];

                                    if (Array.isArray(parentStream[scopePaths[i - 1]]) && scopePath != parseInt(scopePath, 10)) {
                                        parentStream[scopePaths[i - 1]] = {};
                                    }

                                    if (i === scopePaths.length - 1) {
                                        stream[scopePath] = tributaryData.stream;
                                    } else if (null == stream[scopePath] || 'object' !== typeof stream[scopePath]) {
                                        stream[scopePath] = {};
                                    }

                                    parentStream = stream;
                                    stream = stream[scopePath];
                                }

                                parentTributaryData.stream = streamRoot;

                                break;
                            } else {
                                parentTributaryData.stream = tributaryData.stream;
                            }
                        }
                    } else if (undefined === parentTributaryData && scope) {
                        this._mainStream = tributaryData.stream;
                        currentTributaryData.stream = this._mainStream;
                    }

                    currentTributaryData = parentTributaryData;
                }

                if (tributaryData.callback) {
                    tributaryData.callback(tributaryData.stream);
                }

                // Try to delete parent.
                tryTributaryDeletion.call(this, tributaryData.parent);
            } else {
                var scope = tributaryData.scope;

                if (scope) {
                    if ('.' !== scope) {
                        var stream = this._mainStream || {},
                            scopePaths = extractScopePaths(scope),
                            streamRoot = stream
                        ;

                        for (var i = 0; i < scopePaths.length; i++) {
                            var scopePath = scopePaths[i];

                            if (i === scopePaths.length - 1) {
                                stream[scopePath] = tributaryData.stream;
                            } else if ('object' !== typeof stream[scopePath]) {
                                stream[scopePath] = {};
                            }

                            stream = stream[scopePath];
                        }

                        this._mainStream = streamRoot;
                    } else {
                        this._mainStream = tributaryData.stream;
                    }
                }

                if (tributaryData.callback) {
                    tributaryData.callback(tributaryData.stream);
                }
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

'use strict';

/**
 * Expose `Class`.
 */
module.exports = Class;

/**
 * Static variable allowing to handle the asynchronous flow.
 *
 * @var {object}
 */
var __async = {};

if (!Function.prototype.__asyncCall) {
    Function.prototype.__asyncCall = function(target, scope) {
        var args = Array.prototype.slice.call(arguments, 2),
            self = this,
            flow = __async.flow,
            tributary = flow.addTributary(scope),
            result
        ;

        target.__asyncProcess(function(returnAsync) {
            result = self.apply(target, args);

            if (undefined !== result) {
                returnAsync(result);
            } else {
                returnAsync(function(stream) {
                    return stream;
                });
            }
        });

        flow.mergeTributary(tributary);

        return result;
    };
}

if (!Function.prototype.__asyncApply) {
    Function.prototype.__asyncApply = function(target, scope, args, callback) {
        var self = this,
            flow = __async.flow,
            tributary = flow.addTributary(scope, callback),
            result
        ;

        target.__asyncProcess(function(returnAsync) {
            result = self.apply(target, args);

            if (undefined !== result) {
                returnAsync(result);
            } else {
                returnAsync(function(stream) {
                    return stream;
                });
            }
        });
        
        flow.mergeTributary(tributary);

        return result;
    };
}

/**
 * Initialize a new base class.
 */
function Class() {
}

/**
 * Set the current async flow.
 *
 * @param {object} asyncFlow The current async flow.
 * @api public
 */
Object.defineProperty(Class.prototype, '__asyncFlow', {
    get: function() { return __async.flow; },
    set: function(asyncFlow) { __async.flow = asyncFlow; }
});

/**
 * Process an async task.
 *
 * @param {function} callback The task callback.
 * @api public
 */
Class.prototype.__asyncProcess = function(callback) {
    var flow = __async.flow,
        task = flow.wait(),
        end = function(returnedValue) {
            flow.end(task, returnedValue);
        }
    ;

    callback.call(this, end);
}

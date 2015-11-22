'use strict';

/**
 * Expose `FlowContext`.
 */
module.exports = FlowContext;

/**
 * Initialize a new flow context.
 */
function FlowContext() {
}

FlowContext.defineImplementedInterfaces(['danf:sequencing.flowContext']);

/**
 * @interface {danf:manipulation.flowContext}
 */
FlowContext.prototype.set = function(name, item) {
    var context = retrieveAsyncFlowContext.call(this);

    return context.set(name, item);
}

/**
 * @interface {danf:manipulation.flowContext}
 */
FlowContext.prototype.unset = function(name) {
    var context = retrieveAsyncFlowContext.call(this);

    return context.unset(name);
}

/**
 * @interface {danf:manipulation.flowContext}
 */
FlowContext.prototype.clear = function() {
    var context = retrieveAsyncFlowContext.call(this);

    return context.clear();
}

/**
 * @interface {danf:manipulation.flowContext}
 */
FlowContext.prototype.has = function(name) {
    var context = retrieveAsyncFlowContext.call(this);

    return context.has(name);
}

/**
 * @interface {danf:manipulation.flowContext}
 */
FlowContext.prototype.get = function(name) {
    var context = retrieveAsyncFlowContext.call(this);

    return context.get(name);
}

/**
 * @interface {danf:manipulation.flowContext}
 */
FlowContext.prototype.getAll = function() {
    var context = retrieveAsyncFlowContext.call(this);

    return context.getAll();
}

/**
 * Retrieve the current async flow context.
 *
 * @return {danf:manipulation.map} The context.
 * @api private
 */
var retrieveAsyncFlowContext = function() {
    var flow = this.__asyncFlow;

    if (null == flow) {
        throw new Error('No flow currently processing.');
    }

    return flow.context;
}
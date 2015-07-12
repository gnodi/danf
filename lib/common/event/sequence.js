'use strict';

/**
 * Expose `Sequence`.
 */
module.exports = Sequence;

/**
 * Initialize a new sequence.
 *
 * @param {function} operation The main operation of the sequence.
 * @param {danf:dependencyInjection.provider<danf:manipulation:flow>} flowProvider The flow provider.
 */
function Sequence(operation, flowProvider) {
    if (operation) {
        this.operation = operation;
    }
    if (flowProvider) {
        this.flowProvider = flowProvider;
    }
}

Sequence.defineDependency('_operation', 'function');
Sequence.defineDependency('_flowProvider', 'danf:dependencyInjection.provider', 'danf:manipulation.flow');

/**
 * Set the main operation of the sequence.
 *
 * @param {function} The main operation of the sequence.
 * @api public
 */
Object.defineProperty(Sequence.prototype, 'operation', {
    set: function(operation) { this._operation = operation; }
});

/**
 * Set the flow provider.
 *
 * @param {danf:manipulation.flowProvider} The flow provider.
 * @api public
 */
Object.defineProperty(Sequence.prototype, 'flowProvider', {
    set: function(flowProvider) { this._flowProvider = flowProvider; }
});

/**
 * @interface {danf:event.sequence}
 */
Sequence.prototype.execute = function(input, scope, callback) {
    var flow = this._flowProvider.provide(input, scope, callback);

    return this._operation(flow);
}

/**
 * @interface {danf:event.sequence}
 */
Sequence.prototype.forward = function(flow, callback) {
    return this._operation(flow, callback);
}
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
 * @param {danf:dependencyInjection.provider<danf:manipulation:map>} flowProvider The map provider.
 */
function Sequence(operation, flowProvider, mapProvider) {
    if (operation) {
        this.operation = operation;
    }
    if (flowProvider) {
        this.flowProvider = flowProvider;
    }
    if (mapProvider) {
        this.mapProvider = mapProvider;
    }
}

Sequence.defineImplementedInterfaces(['danf:event.sequence']);

Sequence.defineDependency('_operation', 'function');
Sequence.defineDependency('_flowProvider', 'danf:dependencyInjection.provider', 'danf:manipulation.flow');
Sequence.defineDependency('_mapProvider', 'danf:dependencyInjection.provider', 'danf:manipulation.map');

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
 * Set the map provider.
 *
 * @param {danf:manipulation.mapProvider} The map provider.
 * @api public
 */
Object.defineProperty(Sequence.prototype, 'mapProvider', {
    set: function(mapProvider) { this._mapProvider = mapProvider; }
});

/**
 * @interface {danf:event.sequence}
 */
Sequence.prototype.execute = function(input, scope, callback) {
    var context = this._mapProvider.provide({name: 'flow'}),
        flow = this._flowProvider.provide({
            stream: input,
            scope: scope,
            context: context,
            callback: callback
        })
    ;

    return this._operation(flow);
}

/**
 * @interface {danf:event.sequence}
 */
Sequence.prototype.forward = function(flow, callback) {
    return this._operation(flow, callback);
}
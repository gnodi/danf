'use strict';

module.exports = Processor;

function Processor() {
}

// Define the interfaces implemented by the class.
Computer.defineImplementedInterfaces(['processor']);

Computer.defineDependency('_order', 'number');
Computer.defineDependency('_operand', 'number');
Computer.defineDependency('_operation', 'function');

Object.defineProperty(Processor.prototype, 'order', {
    get: function() { return this._order; },
    set: function(order) { this._order = order; }
});

Object.defineProperty(Processor.prototype, 'operand', {
    get: function() { return this._operand; },
    set: function(operand) { this._operand = operand; }
});

Object.defineProperty(Processor.prototype, 'operation', {
    get: function() { return this._operation; },
    set: function(operation) { this._operation = operation; }
});

Processor.prototype.process = function(value) {
    return this._operation(value, this._operand);
}
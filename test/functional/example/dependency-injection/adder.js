'use strict';

/**
 * Expose `Adder`.
 */
module.exports = Adder;

/**
 * Initialize a new adder processor.
 */
function Adder() {
}

Adder.defineImplementedInterfaces(['processor']);

// Define the inherited class.
Adder.defineExtendedClass('processor.abstract');

/**
 * @interface {processor}
 */
Object.defineProperty(Adder.prototype, 'operation', {
    get: function() { return '@'; }
});

/**
 * @inheritdoc
 */
Object.defineProperty(Adder.prototype, 'neutralElement', {
    get: function() { return 0; }
});

/**
 * @inheritdoc
 */
Adder.prototype.processOperation = function(operand1, operand2) {
    return operand1 + operand2;
}
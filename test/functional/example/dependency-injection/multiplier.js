'use strict';

/**
 * Expose `Multiplier`.
 */
module.exports = Multiplier;

/**
 * Initialize a new multiplier processor.
 */
function Multiplier() {
}

Multiplier.defineImplementedInterfaces(['processor']);

// Define the inherited class.
Multiplier.defineExtendedClass('processor.abstract');

/**
 * @interface {processor}
 */
Object.defineProperty(Multiplier.prototype, 'operation', {
    get: function() { return '*'; }
});

/**
 * @inheritdoc
 */
Object.defineProperty(Multiplier.prototype, 'neutralElement', {
    get: function() { return 1; }
});

/**
 * @inheritdoc
 */
Multiplier.prototype.processOperation = function(operand1, operand2) {
    return operand1 * operand2;
}
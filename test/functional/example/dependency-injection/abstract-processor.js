 'use strict';

/**
 * Expose `AbstractProcessor`.
 */
module.exports = AbstractProcessor;

/**
 * Initialize a new abstract processor.
 */
function AbstractProcessor() {
    Object.hasGetter(this, 'neutralElement');
    Object.hasMethod(this, 'processOperation');
}

AbstractProcessor.defineImplementedInterfaces(['processor']);

// Define the class as an abstract non instantiable class.
AbstractProcessor.defineAsAbstract();

/**
 * @interface {processor}
 */
AbstractProcessor.prototype.process = function(operand1, operand2) {
    if (undefined === operand2) {
        operand2 = this.neutralElement;
    }

    return this.processOperation(operand1, operand2);
}
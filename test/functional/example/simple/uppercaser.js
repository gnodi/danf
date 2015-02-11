'use strict';

/**
 * Expose `Uppercaser`.
 */
module.exports = Uppercaser;

// Definition of the constructor.
/**
 * Initialize a new uppercaser.
 */
function Uppercaser() {
}

// Define the implemented interfaces.
// Here, Uppercaser is implementing the interface "wordProcessor".
Uppercaser.defineImplementedInterfaces(['wordProcessor']);

// Implementation of the method of the interface.
/**
 * @interface {wordProcessor}
 */
Uppercaser.prototype.process = function(word) {
    return word.toUpperCase();
}
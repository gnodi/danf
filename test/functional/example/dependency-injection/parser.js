'use strict';

/**
 * Expose `Parser`.
 */
module.exports = Parser;

/**
 * Initialize a new adder processor.
 */
function Parser() {
}

Parser.defineImplementedInterfaces(['parser']);

/**
 * @interface {processor}
 */
Parser.prototype.parse = function(operation) {
    return operation.split(' ');
}
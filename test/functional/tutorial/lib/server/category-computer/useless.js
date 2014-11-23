'use strict';

/**
 * Expose `Useless`.
 */
module.exports = Useless;

/**
 * Initialize a new useless category computer.
 */
function Useless() {
}

// Define the implemented interfaces.
Useless.defineExtentedClass('categoryComputer.abstract');

/**
 * @inheritdoc
 */
Useless.prototype.computeBoost = function() {
    return this._boost * 2;
}